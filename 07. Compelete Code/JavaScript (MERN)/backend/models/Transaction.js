const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    amount: {
      type: Number,
      required: true,
      validate: {
        validator: function (v) {
          return v > 0;
        },
        message: (props) =>
          `Amount must be greater than zero. Received: ${props.value}`,
      },
    },
    checkoutId: {
      type: String,
      unique: true,
      required: true,
    },
    mpesaCode: {
      type: String,
      unique: true,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
      validate: {
        validator: function (v) {
          return /^254\d{9}$/.test(v); // Matches all 12-digit Kenyan numbers
        },
        message: (props) => `${props.value} is not a valid phone number!`,
      },
    },
    status: {
      type: String,
      required: true,
      enum: ["Pending", "Completed", "Failed"],
      default: "Pending",
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Virtual field for a string representation of the transaction
transactionSchema.virtual("description").get(function () {
  return `${this.mpesaCode} - ${(this.amount / 100).toFixed(2)} KES`;
});

// Indexing for better query performance
transactionSchema.index({ mpesaCode: 1, checkoutId: 1, phoneNumber: 1 });

// Middleware for logging updates
transactionSchema.pre("save", function (next) {
  console.log(`Transaction is being saved: ${this}`);
  next();
});

// Middleware for handling updates (if needed)
transactionSchema.pre("findOneAndUpdate", function (next) {
  console.log(`Transaction is being updated: ${this.getUpdate()}`);
  next();
});

module.exports = mongoose.model("Transaction", transactionSchema);
