import mongoose from "mongoose";

const bloodBankSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "BloodBankCategory",
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    pincode: {
        type: Number,
        default: null,
    },
    contactNumber: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    specialties: [
        {
            type: String,
            required: true,
        },
    ],
    isActive: {
        type: Boolean,
        default: false,
    },
    bloodBankCoverImg: {
        type: String,  // Cloudinary URL of the main image
        required: false,
        default: "",
    },
    bloodBankImg: [
        {
            type: String, // Cloudinary URL of the sub image
        },
    ],
});



const BloodBank = mongoose.model("BloodBank", bloodBankSchema);

export default BloodBank;
