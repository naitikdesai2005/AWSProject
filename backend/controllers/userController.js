import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import validator from "validator";
import nodemailer  from "nodemailer";
import crypto  from "crypto";
import bakerModel from "../models/bakerModel.js";
import productModel from "../models/productModel.js";
import contactusModel from "../models/contactusModel.js"
// Create token
const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET);
};

// Login user
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await userModel.findOne({ email });
        const baker = await bakerModel.findOne({ email });
       

        if (!user && !baker) {
            return res.json({ success: false, message: "User or baker not exists" });
        }

        if (user) {
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.json({ success: false, message: "Invalid Password",data: user });
            }

            if (user.role === "admin") {
                const token = createToken(user._id);
                return res.json({ success: true, token, message: "admin" });
            } else if (user.role === "user") {
                const token = createToken(user._id);
                return res.json({ success: true, token, message: "user" });
            } else {
                return res.json({ success: false, message: "Role is not decided" });
            }
        }

        if (baker) {
            const isMatch = await bcrypt.compare(password, baker.password);
            if (!isMatch) {
                return res.json({ success: false, message: "Invalid Password" });
            }
            if (baker.role === "baker") {
                const token = createToken(baker._id);
                return res.json({ success: true, token, message: "baker" });
            } else {
                return res.json({ success: false, message: "Role is not decided" });
            }
        }
    } catch (error) {
        return res.json({ success: false, message: "Error" });
    }
};


//for sending code via email
const forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await userModel.findOne({ email });
        const baker = await bakerModel.findOne({ email });

        if (!user && !baker) {
            return res.json({ success: false, message: "User or baker not exists" });
        }

        const uniqueCode = crypto.randomBytes(3).toString('hex');
        const expirationTime = Date.now() + 3600000; // Code expires in 1 hour

        if (user) {
            user.resetCode = uniqueCode;
            user.resetCodeExpires = expirationTime;
            await user.save();
        } else if (baker) {
            baker.resetCode = uniqueCode;
            baker.resetCodeExpires = expirationTime;
            await baker.save();
        }

        const transporter = nodemailer.createTransport({
            service: 'gmail', 
            auth: {
                user: 'bakenest9@gmail.com', // Your email
                pass: 'aghm pbse asnm gbwv' // Your email password or app password
            }
        });

        const mailOptions = {
            from: 'bakenest9@gmail.com',
            to: email,
            subject: 'Password Reset Code',
            text: `Your password reset code is: ${uniqueCode}. It will expire in 1 hour.`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error);
            }
            return res.json({ success: true, message: "Password reset code sent to email." });
        });

    } catch (error) {
        console.error(error);
        return res.json({ success: false, message: "Error resetting password." });
    }
};

// Function to verify the code and reset the password
const verifyCodeAndResetPassword = async (req, res) => {
    const { email, code, password, confirmPassword } = req.body;

    try {
        const user = await userModel.findOne({ email });
        const baker = await bakerModel.findOne({ email });

        if (!user && !baker) {
            return res.json({ success: false, message: "User or baker not exists" });
        }

        let targetUser = user || baker;

        if (targetUser.resetCode !== code || Date.now() > targetUser.resetCodeExpires) {
            return res.json({ success: false, message: "Invalid or expired code." });
        }

        if (password !== confirmPassword) {
            return res.json({ success: false, message: "Passwords do not match." });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        targetUser.password = hashedPassword;
        targetUser.resetCode = undefined; // Clear the reset code
        targetUser.resetCodeExpires = undefined; // Clear the expiration time
        await targetUser.save();

        return res.json({ success: true, message: "Password reset successful." });

    } catch (error) {
        console.error(error);
        return res.json({ success: false, message: "Error resetting password." });
    }
};



// Register user
const registerUser = async (req, res) => {
    const { name, password, email } = req.body;
    try {
        const exists = await userModel.findOne({ email });
        if (exists) {
            return res.json({ success: false, message: "User already exists" });
        }

        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Invalid email" });
        }
        if (password.length < 8) {
            return res.json({ success: false, message: "Password must be at least 8 characters" });
        }

        // Hashing user password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new userModel({
            name: name,
            email: email,
            password: hashedPassword,
        });

        const user = await newUser.save();
        const token = createToken(user._id);
        res.json({ success: true, token, message: "user" });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Something went wrong!!!" });
    }
};

// Register admin
const registerAdmin = async (req, res) => {
    const { name, password, email } = req.body;
    try {
        const exists = await userModel.findOne({ email });
        if (exists) {
            return res.json({ success: false, message: "User already exists" });
        }

        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Invalid email" });
        }
        if (password.length < 8) {
            return res.json({ success: false, message: "Password must be at least 8 characters" });
        }

        // Hashing user password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new userModel({
            name: name,
            email: email,
            password: hashedPassword,
        });

        if (newUser.email === "Admin@gmail.com") {
            newUser.role = "admin";
        }

        const user = await newUser.save();
        const token = createToken(user._id);
        res.json({ success: true, token, message: "admin" });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Something went wrong!!!" });
    }
};

// Register baker
const registerBaker = async (req, res) => {
    const { name, password, email, bakeryname, bakeryaddress, gender, bankAccNumber, mobilenumber } = req.body;
    try {
        const exists = await bakerModel.findOne({ email });
        if (exists) {
            return res.json({ success: false, message: "Baker already exists" });
        }

        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Invalid email" });
        }
        if (password.length < 8) {
            return res.json({ success: false, message: "Password must be at least 8 characters" });
        }

        // Hashing user password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newBaker = new bakerModel({
            name: name,
            email: email,
            password: hashedPassword,
            gender: gender,
            bakeryname: bakeryname,
            bakeryaddress: bakeryaddress,
            bankAccNumber: bankAccNumber,
            mobilenumber: mobilenumber,
        });

        const baker = await newBaker.save();
        const token = createToken(baker._id);
        res.json({ success: true, token, message: "baker" });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Something went wrong!!!" });
    }
};

// Get all items
// const allitem = async (req, res) => {
//     try {
//         const items = await productModel.find();
//         if (items.length > 0) {
//             res.json({ success: true, data: items });
//         } else {
//             res.json({ success: true, message: "No items in inventory" });
//         }
//     } catch (error) {
//         console.log(error);
//         res.json({ success: false, message: "Something went wrong" });
//     }
// };

const allitem = async (req, res) => {
    try {
        const items = await productModel.find();
        if (items.length > 0) {
            res.json({ success: true, data: items });
        } else {
            res.json({ success: true, message: "No items in inventory" });
        }
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Something went wrong" });
    }
};


// Logout user
const logout = async (req, res) => {
    try {
        // Remove the token from local storage
        res.json({ success: true, message: "Logout Successfuly" })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Something went wrong" });
    }
}

//search bakery
const search = async (req, res) => {
    try {
        let bakeryName = req.body.bakeryName;
        let items = await productModel.find({ bakeryName: bakeryName });
        if (items.length > 0) {
            res.json({ success: true, data: items });
        } else {
            res.json({ success: true, message: "No items in inventory" });
        }
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Something went wrong" });
    }
}


const bakerProfile = async (req, res) => {
    try {
        const { userId } = req.body;
        const bakerData = await bakerModel.findById(userId);

        if (!bakerData) {
            return res.status(404).json({ success: false, message: "Baker data not found." });
        }

        return res.status(200).json({
            success: true,
            data: {
                email: bakerData.email,
                mobilenumber: bakerData.mobilenumber,
                bakeryName: bakerData.bakeryname,
                bakeryaddress: bakerData.bakeryaddress,
                gender: bakerData.gender,
                bio: bakerData.bio,
                bankAccNumber: bakerData.bankAccNumber,
            }
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Something went wrong" });
    }
}


const updateBakerProfile = async (req, res) => {
    try {
        const { userId, name, email, bakeryname, bakeryaddress, gender, bankAccNumber, mobilenumber, bio, link } = req.body;

        // Handle file upload (check if file exists)
        let profileImage = req.file ? `${req.file.filename}` : undefined;

        const updateData = await bakerModel.findByIdAndUpdate(userId, {
            name,
            email,
            bakeryname,
            bakeryaddress,
            gender,
            bankAccNumber,
            mobilenumber,
            bio,
            link,
            ...(profileImage && { image: profileImage })
        }, { new: true });

        await updateData.save();

        return res.json({ success: true, message: "Profile updated successfully" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Something went wrong" });
    }
};

const createContactUs = async(req,res) => {
    try {
        const { name,email,phone,message} = req.body;
        const newContact = new contactusModel({
            name: name,
            email: email,
            phone: phone,
            message: message
        });

        const contactus = await newContact.save();
        res.json({ success: true,message: "submitted", contactus});
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Something went wrong" });
    }
};

const deleteContactUs = async(req,res) => {
    try {
        const { userId, contactusId } = req.body;
        
        const deleteResult = await contactusModel.findOne({ _id: contactusId});
        if (deleteResult) {
            const deleteResult = await contactusModel.deleteOne({ _id: contactusId});
            console.log('Deleted contactus');
        } else {
            console.log('No document found to delete.');
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Something went wrong" });
    }
};
const getAllContacts = async (req, res) => {
    try {
      const contacts = await contactusModel.find();
      res.json({ success: true, contacts });
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: "Unable to fetch contacts" });
    }
  };


const sendEmail = async (req, res) => {
  const { email, message } = req.body;

  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: 'bakenest9@gmail.com',
        pass: 'aghm pbse asnm gbwv' 
    },
    tls: {
        rejectUnauthorized: false,
      },
  });

  try {
 
    await transporter.sendMail({
      from: 'bakenest9@gmail.com',
      to: email,
      subject: "Response to Your Query",
      text: message, 
    });

    res.json({ success: true, message: "Email sent successfully" });
  } catch (error) {
    console.log("Error sending email:", error);
    res.status(500).json({ success: false, message: "Email failed to send" });
  }
};

  
export { loginUser, registerUser, registerBaker,sendEmail, registerAdmin, getAllContacts,allitem, logout, search, bakerProfile,createContactUs, updateBakerProfile,forgotPassword,verifyCodeAndResetPassword };
