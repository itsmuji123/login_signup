const { Card, Code, Service } = require('../models/user');
const mongoose = require('mongoose');


const createService = async (req, res) => {
  try {
    const { name } = req.body;

    // Check if a service with the same name already exists
    const existingService = await Service.findOne({ name });
    if (existingService) {
      return res.status(400).json({ message: 'Service with the same name already exists.' });
    }

    // Create a new service
    const newService = new Service({ name });
    const savedService = await newService.save();

    res.status(201).json(savedService);
  } catch (error) {
    console.error('Error creating service:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const getServices = async (req, res) => {
  try {
    // Retrieve all services
    const services = await Service.find();

    res.status(200).json({ services });
  } catch (error) {
    console.error('Error getting services:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const getServiceById = async (req, res) => {
  try {
    const { serviceId } = req.params;

    // Check if the provided serviceId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(serviceId)) {
      return res.status(400).json({ message: 'Invalid serviceId.' });
    }

    // Retrieve the service by its ID
    const service = await Service.findById(serviceId);

    // Check if the service with the specified ID exists
    if (!service) {
      return res.status(404).json({ message: 'Service not found.' });
    }

    res.status(200).json({ service });
  } catch (error) {
    console.error('Error getting service by ID:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};


const editService = async (req, res) => {
  try {
    const { serviceId } = req.params;
    const { name } = req.body;

    // Check if the service exists
    const existingService = await Service.findById(serviceId);
    if (!existingService) {
      return res.status(404).json({ message: 'Service not found.' });
    }

    // Check if a service with the new name already exists
    const existingServiceWithNewName = await Service.findOne({ name });
    if (existingServiceWithNewName && existingServiceWithNewName._id.toString() !== serviceId) {
      return res.status(400).json({ message: 'Service with the same name already exists.' });
    }

    // Update the service name
    existingService.name = name;
    const updatedService = await existingService.save();

    res.status(200).json(updatedService);
  } catch (error) {
    console.error('Error editing service:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

  
const deleteService = async (req, res) => {
  try {
    const { serviceId } = req.params;

    // Check if the service exists
    const existingService = await Service.findById(serviceId);
    if (!existingService) {
      return res.status(404).json({ message: 'Service not found.' });
    }

    // Remove the service reference from associated cards
    await Card.updateMany({ service: existingService._id }, { $unset: { service: 1 } });

    // Delete the service
    await Service.deleteOne({ _id: existingService._id });

    return res.status(200).json({ message: 'Service deleted successfully & dereferenced from respective cards.' });
  } catch (error) {
    console.error('Error deleting service:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};




   
  module.exports = {
    createService,
    editService,
    deleteService,
    getServices,
    getServiceById
  };
  