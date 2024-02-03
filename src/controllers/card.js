const { Card,  Service } = require('../models/user');

const createCard = async (req, res) => {
  try {
    const { name, price, serviceName, endPrice } = req.body;

    // Find the service by name to get its ID
    const service = await Service.findOne({ name: serviceName });
    if (!service) {
      return res.status(404).json({ message: 'Service not found.' });
    }

    // Create a new card with the generated codes
    const newCard = new Card({
      name,
      price,
      service: service._id, // Use the service ID instead of serviceName
      endPrice,
    });

    try {
      const savedCard = await newCard.save();

      // Update the service to include the new card
      await Service.findByIdAndUpdate(service._id, { $push: { cards: savedCard._id } });

      res.status(201).json(savedCard);
    } catch (error) {
      if (error.code === 11000) {
        // Duplicate key error (name already exists)
        return res.status(400).json({ message: 'Card with the same name already exists.' });
      }
      throw error;
    }
  } catch (error) {
    console.error('Error creating card:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Edit a card
const editCard = async (req, res) => {
  try {
    const { cardId } = req.params;
    const { name, price, serviceName, endPrice } = req.body;

    // Find the service by name to get its ID
    const service = await Service.findOne({ name: serviceName });
    if (!service) {
      return res.status(404).json({ message: 'Service not found.' });
    }

    // Find the card by ID
    const existingCard = await Card.findById(cardId);
    if (!existingCard) {
      return res.status(404).json({ message: 'Card not found.' });
    }

    // Check if the card belongs to the specified service
    if (existingCard.service.toString() !== service._id.toString()) {
      return res.status(400).json({ message: 'Card does not belong to the specified service.' });
    }

    // Update the card properties
    existingCard.name = name;
    existingCard.price = price;
    existingCard.endPrice = endPrice;

    const updatedCard = await existingCard.save();

    // Check if the card ID already exists in the service's cards array
    // if (service.cards.includes(updatedCard._id)) {
    //   return res.status(400).json({ message: 'Card ID already exists in the service.' });
    // } 


    // Update the service's cards array with the updated card
    service.cards.push(updatedCard._id);
    await service.save();
    console.log('object')

    res.status(200).json(updatedCard);
  } catch (error) {
    console.error('Error editing card:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};


// Delete a card
const deleteCard = async (req, res) => {
  try {
    const { cardId } = req.params;

    // Find the card by ID
    const existingCard = await Card.findById(cardId);
    if (!existingCard) {
      return res.status(404).json({ message: 'Card not found.' });
    }

    // Remove the card reference from associated service
    await Service.findByIdAndUpdate(existingCard.service, { $pull: { cards: existingCard._id } });

    // Delete the card
    await Card.deleteOne({ _id: existingCard._id });


    res.status(200).json({ message: 'Card deleted successfully.' });
  } catch (error) {
    console.error('Error deleting card:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Get all cards
const getCards = async (req, res) => {
  try {
    const cards = await Card.find().populate('service', 'name'); // Populate service field with service name

    res.status(200).json({ cards });
  } catch (error) {
    console.error('Error getting cards:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Get a card by ID
const getCardById = async (req, res) => {
  try {
    const { cardId } = req.params;

    // Find the card by ID
    const card = await Card.findById(cardId).populate('service', 'name'); // Populate service field with service name

    if (!card) {
      return res.status(404).json({ message: 'Card not found.' });
    }

    res.status(200).json({ card });
  } catch (error) {
    console.error('Error getting card by ID:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const getAllCardsByService = async (req, res) => {
  try {
    const { serviceName } = req.body; // Use req.params to get the service name from the URL

    // Find the service by name to get its ID
    const service = await Service.findOne({ name: serviceName });
    if (!service) {
      return res.status(404).json({ message: 'Service not found.' });
    }

    // Find all cards associated with the service
    const cards = await Card.find({ _id: { $in: service.cards } }); // Use the array of card IDs in the service

    res.status(200).json({ cards });
  } catch (error) {
    console.error('Error getting cards by service:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};


module.exports = {
  createCard,
  editCard,
  deleteCard,
  getCards,
  getCardById,
  getAllCardsByService
};
