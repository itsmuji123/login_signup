const { Code, Card, Service, User } = require('../models/user');

const createCode = async (req, res) => {
  try {
    const { serial, pin, cardName, serviceName } = req.body;

    // Find the service by name to get its ID
    const service = await Service.findOne({ name: serviceName });
    if (!service) {
      return res.status(404).json({ message: 'Service not found.' });
    }

    // Check if the service has the specified card
    const existingCard = await Card.findOne({ name: cardName, service: service._id });
    if (!existingCard) {
      return res.status(404).json({ message: 'Card not found in the specified service.' });
    }

    // Check if a code with the provided serial or pin already exists
    const existingCode = await Code.findOne({ $or: [{ serial }, { pin }] });
    if (existingCode) {
      return res.status(400).json({ message: 'Code with the same serial or pin already exists.' });
    }

    // Create a new code for the card
    const newCode = new Code({
      pin,
      serial,
    });

    // Save the new code to the database
    const savedCode = await newCode.save();

    // Update the card to include the new code and calculate quantity
    const updatedCard = await Card.findByIdAndUpdate(
      existingCard._id,
      { $push: { codes: savedCode._id } },
      { new: true } // Ensure you get the updated card document
    ).populate('codes');

    // Calculate quantity after updating the card
    updatedCard.quantity = updatedCard.codes.length - updatedCard.Inuse;

    // Save the updated card
    await updatedCard.save();

    // Send the response with the saved code
    res.status(201).json(savedCode);
  } catch (error) {
    console.error('Error creating code:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};




const deleteCode = async (req, res) => {
  try {
    const { pin, serial } = req.body;

    // Find the code to get its associated card
    const code = await Code.findOne({ pin, serial });
    if (!code) {
      return res.status(404).json({ message: 'Code not found.' });
    }

    // Check if the code is used in any purchase
    const isCodePurchased = await User.exists({ 'purchases.codeId': code._id });
    if (isCodePurchased) {
      return res.status(400).json({ message: 'Code is already purchased and cannot be deleted.' });
    }

    // Find the card associated with the code
    const card = await Card.findOne({ codes: code._id });
    if (!card) {
      return res.status(404).json({ message: 'Card not found for the code.' });
    }

    // Remove the code from the card and update quantity
    const updatedCard = await Card.findByIdAndUpdate(
      card._id,
      { $pull: { codes: code._id }, $inc: { quantity: -1 } },
      { new: true } // Ensure you get the updated card document
    ).populate('codes');

    // Calculate quantity after updating the card
    updatedCard.quantity = updatedCard.codes.length - updatedCard.Inuse;

    // Save the updated card
    await updatedCard.save();

    // Delete the code
    await Code.findByIdAndRemove(code._id);

    res.status(200).json({ message: 'Code deleted successfully.' });
  } catch (error) {
    console.error('Error deleting code:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
  
// Get all codes
const getCodes = async (req, res) => {
  try {
    const codes = await Code.find();

    res.status(200).json({ codes });
  } catch (error) {
    console.error('Error getting codes:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const getCodeByPinAndSerial = async (req, res) => {
  try {
    const { pin, serial } = req.body;

    // Find the code by pin and serial
    const code = await Code.findOne({ pin, serial });
    if (!code) {
      return res.status(404).json({ message: 'Code not found.' });
    }

    res.status(200).json(code);
  } catch (error) {
    console.error('Error getting code by pin and serial:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const editCode = async (req, res) => {
  try {
    const { pin, serial, newPin, newSerial, cardName, serviceName } = req.body;

    // Find the service by name to get its ID
    const service = await Service.findOne({ name: serviceName });
    if (!service) {
      return res.status(404).json({ message: 'Service not found.' });
    }

    // Check if the service has the specified card
    const existingCard = await Card.findOne({ name: cardName, service: service._id });
    if (!existingCard) {
      return res.status(404).json({ message: 'Card not found in the specified service.' });
    }

    // Find the code by pin and serial
    const existingCode = await Code.findOne({ pin, serial });
    if (!existingCode) {
      return res.status(404).json({ message: 'Code not found.' });
    }

    // Check if the new pin or serial already exists
    const codeWithNewPin = await Code.findOne({ pin: newPin });
    const codeWithNewSerial = await Code.findOne({ serial: newSerial });

    if (codeWithNewPin && codeWithNewPin._id.toString() !== existingCode._id.toString()) {
      return res.status(400).json({ message: 'Code with the new pin already exists.' });
    }

    if (codeWithNewSerial && codeWithNewSerial._id.toString() !== existingCode._id.toString()) {
      return res.status(400).json({ message: 'Code with the new serial already exists.' });
    }

    // Detach the code from the old card
    const oldCard = await Card.findOne({ codes: existingCode._id });
    if (oldCard) {
      await Card.findByIdAndUpdate(oldCard._id, {
        $pull: { codes: existingCode._id },
        $inc: { quantity: -1 },
      });
    }

    // Attach the code to the new card
    await Card.findByIdAndUpdate(existingCard._id, {
      $push: { codes: existingCode._id },
      $inc: { quantity: 1 },
    });

    // Update the code with the new pin and/or serial
    existingCode.pin = newPin || existingCode.pin;
    existingCode.serial = newSerial || existingCode.serial;

    const updatedCode = await existingCode.save();

    res.status(200).json(updatedCode);
  } catch (error) {
    console.error('Error editing code:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = {
  createCode,
  getCodes,
  getCodeByPinAndSerial,
  editCode,
  deleteCode,
};