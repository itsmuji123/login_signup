const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {User, Service, Card, Code} = require('../models/user'); // Import the User model

exports.signup = async (req, res) => {
  try {
    // Extract user input from request body
    const { name, email, ph, wallet, taxID, workID, password } = req.body;

    // Check if a user with the same email already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) { 
      console.log('User with this email already exists.');
      return res.status(400).json({ message: 'User with this email already exists.' });
    }

    // Hash the password before saving it to the database
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user document
    const newUser = new User({
      name,
      email,
      ph,
      wallet,
      taxID,
      workID,
      password: hashedPassword,
    });

    // Save the user to the database
    await newUser.save();

    // Respond with a success message
    res.status(201).json({ message: 'User registered successfully.' });
  } catch (error) {
    console.error('Error during user registration:', error);
    res.status(500).json({ message: 'An error occurred while registering the user.' });
  }
};




exports.login = async (req, res) => {
  try {
    // Extract user input from request body
    const { email, password } = req.body;
    // console.log(email, password)

    // Find the user by email
    const user = await User.findOne({ email });
    // console.log(user)

    // Check if the user exists
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Compare the provided password with the hashed password in the database

    console.log('password: ', password)
    console.log('user.password: ', user.password)
    const passwordMatch = await bcrypt.compare(password, user.password);
    // console.log('object')

    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid password.' });
    }

    // Create a token with user information
    const token = jwt.sign(
      {
        userId: user._id,
        name: user.name,
        email: user.email,
        ph: user.ph,
        wallet: user.wallet,
        taxID: user.taxID,
        workID: user.workID,
      },
      'your-secret-key',
      { expiresIn: '1h' }
    );

    // Respond with the token and user data
    res.status(200).json({
      token,
      userId: user._id,
      name: user.name,
      email: user.email,
      ph: user.ph,
      wallet: user.wallet,
      taxID: user.taxID,
      workID: user.workID,
    });
  } catch (error) {
    console.error('Error during user login:', error);
    res.status(500).json({ message: 'An error occurred while logging in.' });
  }
};



exports.check = async (req,res) => {
    
    try {
      // The user data (including the "exp" claim) is available in req.user if the token is valid
      if (!req.user) {
        return res.status(401).json({ message: 'Authentication required.' });
      }
  
      // Check if the token has expired
      const currentTimestamp = Math.floor(Date.now() / 1000);
      if (req.user.exp < currentTimestamp) {
        return res.status(401).json({ message: 'Token has expired.' });
      }
  
      // If the token is valid and not expired, you can consider the user authenticated
      res.status(200).json({ message: 'Authenticated', user: req.user });
    } catch (error) {
      console.error('Error during token check:', error);
      res.status(500).json({ message: 'An error occurred while checking the token.' });
    }
  };

// users functions to be added

// Function to edit a user
exports.editUser = async (req, res) => {
  try {
    const { userId } = req.params; // Assuming you pass the userId in the URL params
    const { name, email, ph, wallet, taxID, workID, password } = req.body;

    // Find the user by userId
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Update user data
    user.name = name;
    user.email = email;
    user.ph = ph;
    user.wallet = wallet;
    user.taxID = taxID;
    user.workID = workID;

    // If a new password is provided, hash and update it
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
    }

    // Save the updated user data to the database
    await user.save();

    res.status(200).json({ message: 'User updated successfully.', user });
  } catch (error) {
    console.error('Error editing user:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Function to delete a user
exports.deleteUser = async (req, res) => {
  try {
    const { userId } = req.params; // Assuming you pass the userId in the URL params

    // Find the user by userId and delete it
    const result = await User.deleteOne({ _id: userId });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'User not found.' });
    }

    res.status(200).json({ message: 'User deleted successfully.' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};


// Function to get all users
exports.getUsers = async (req, res) => {
  try {
    // Retrieve all users from the database
    const users = await User.find();

    res.status(200).json(users);
  } catch (error) {
    console.error('Error getting users:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Function to get a user by userId
exports.getUserById = async (req, res) => {
  try {
    const { userId } = req.params; // Assuming you pass the userId in the URL params

    // Find the user by userId
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('Error getting user by ID:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};


// Function to purchase a card for a user
exports.purchaseCard = async (req, res) => {
  try {
    const { userId } = req.params; // Assuming you pass the userId in the URL params
    const { serviceName, cardName, quantity } = req.body;
    
    // Find the user by userId
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Find the service by name
    const service = await Service.findOne({ name: serviceName });

    if (!service) {
      return res.status(404).json({ message: 'Service not found.' });
    }

    // Find the card by name and service
    const card = await Card.findOne({ name: cardName, service: service._id });

    if (!card) {
      return res.status(404).json({ message: 'Card not found.' });
    }

    // Calculate the total cost
    const totalCost = card.price * quantity;

    // Check if the user has enough balance
    if (user.wallet < totalCost) {
      return res.status(403).json({ message: 'Insufficient funds.' });
    }

    // Check card availability
    const availableQuantity = card.quantity;

    if (availableQuantity < quantity) {
      return res.status(400).json({ message: 'Not enough cards available.' });
    }

    // Deduct the amount from the user's wallet
    user.wallet -= totalCost;

    // Get one of the codes associated with the card
    const code = await Code.findOneAndUpdate(
      { _id: { $in: card.codes }, usedBy: null }, // Find an unused code
      { usedBy: user._id }, // Allocate the code to the user
      { new: true }
    );

    if (!code) {
      return res.status(404).json({ message: 'No available codes for the card.' });
    }

    const pin = code.pin;
    const serial = code.serial;

    // Create a purchase record
    const purchase = {
      serviceId: service._id,
      cardId: card._id,
      cardPrice:card.price,
      codeId: code._id,
      serviceName: serviceName,
      cardName: cardName,
      PIN:pin,
      SERIAL: serial,
      dateOfPurchase: new Date(),
    };

      // Update card Inuse and quantity atomically
    const updatedCard = await Card.findByIdAndUpdate(card._id, {
      $inc: { Inuse: quantity, quantity: -1 * quantity }
    }, { new: true });

    // Update the user's purchases array
    user.purchases.push(purchase);

    // Update card quantity (decrease by purchased quantity)
    card.quantity -= quantity;

    // Save changes to the database
    await Promise.all([user.save(), card.save()]);

    res.status(200).json({ message: 'Card purchased successfully.', user });
  } catch (error) {
    console.error('Error purchasing card:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};



// Function to purchase a card for a user
// exports.purchaseCard = async (req, res) => {
//   try {
//     const { userId } = req.params; // Assuming you pass the userId in the URL params
//     const { serviceName, cardName, quantity } = req.body;

//     // Find the user by userId
//     const user = await User.findById(userId);

//     if (!user) {
//       return res.status(404).json({ message: 'User not found.' });
//     }
//     // Find the service by name
//     const service = await Service.findOne({ name: serviceName });

//     if (!service) {
//       return res.status(404).json({ message: 'Service not found.' });
//     }

//     // Find the card by name and service
//     const card = await Card.findOne({ name: cardName, service: service._id });

//     if (!card) {
//       return res.status(404).json({ message: 'Card not found.' });
//     }

//     // Calculate the total cost
//     const totalCost = card.price * quantity;

//     // Check if the user has enough balance
//     if (user.wallet < totalCost) {
//       return res.status(403).json({ message: 'Insufficient funds.' });
//     }

//     // Check card availability
//     const availableQuantity = card.quantity;

//     if (availableQuantity < quantity) {
//       return res.status(400).json({ message: 'Not enough cards available.' });
//     }

//     // Deduct the amount from the user's wallet
//     user.wallet -= totalCost;

//     // Get the associated code with the card
//     const code = await Code.findById(card.codes[0]); // Assuming there is only one code associated with a card

//     if (!code) {
//       return res.status(404).json({ message: 'Code not found for the card.' });
//     }

//     // Create a purchase record
//     const purchase = {
//       serviceId: service._id,
//       cardId: card._id,
//       codeId: code._id, // Include the code ID in the purchase
//       dateOfPurchase: new Date(),
//     };

//     // Update the user's purchases array
//     user.purchases.push(purchase);

//     // Update card Inuse and quantity atomically
//     const updatedCard = await Card.findByIdAndUpdate(card._id, {
//       $inc: { Inuse: quantity, quantity: -1 * quantity }
//     }, { new: true });

//     // Save changes to the database
//     await user.save();

//     res.status(200).json({ message: 'Card purchased successfully.', user });
//   } catch (error) {
//     console.error('Error purchasing card:', error);
//     res.status(500).json({ message: 'Internal Server Error' });
//   }
// };


// Function to set the balance (wallet) of a user by their ID
exports.setUserBalanceById = async (req, res) => {
  try {
    const { userId } = req.params; // Assuming you pass the userId in the URL params
    const { newBalance } = req.body;

    // Check if newBalance is provided and valid
    if (!newBalance || isNaN(newBalance)) {
      return res.status(400).json({ message: 'Invalid new balance.' });
    }

    // Find the user by userId
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Set the new balance
    user.wallet = newBalance;

    // Save the updated user data to the database
    await user.save();

    res.status(200).json({ message: 'User balance updated successfully.', user });
  } catch (error) {
    console.error('Error setting user balance:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
// Function to purchase a card for a user
// exports.purchaseCard = async (req, res) => {
//   try {
//     const { userId } = req.params; // Assuming you pass the userId in the URL params
//     const { serviceName, cardName, quantity } = req.body;

//     // Find the user by userId
//     const user = await User.findById(userId);

//     if (!user) {
//       return res.status(404).json({ message: 'User not found.' });
//     }
//     // Find the service by name
//     const service = await Service.findOne({ name: serviceName });

//     if (!service) {
//       return res.status(404).json({ message: 'Service not found.' });
//     }

//     // Find the card by name and service
//     const card = await Card.findOne({ name: cardName, service: service._id });

//     if (!card) {
//       return res.status(404).json({ message: 'Card not found.' });
//     }

//     // Calculate the total cost
//     const totalCost = card.price * quantity;

//     // Check if the user has enough balance
//     if (user.wallet < totalCost) {
//       return res.status(403).json({ message: 'Insufficient funds.' });
//     }

//     // Check card availability
//     const availableQuantity = card.codes.length - card.Inuse;

//     if (availableQuantity < quantity) {
//       return res.status(400).json({ message: 'Not enough cards available.' });
//     }

//     // Deduct the amount from the user's wallet
//     user.wallet -= totalCost;

//     // Get the associated code with the card
//     const code = await Code.findById(card.codes[0]); // Assuming there is only one code associated with a card

//     if (!code) {
//       return res.status(404).json({ message: 'Code not found for the card.' });
//     }

//     // Create a purchase record
//     const purchase = {
//       serviceId: service._id,
//       cardId: card._id,
//       codeId: code._id, // Include the code ID in the purchase
//       dateOfPurchase: new Date(),
//     };

//     // Update the user's purchases array
//     user.purchases.push(purchase);

//     // Increment the Inuse field of the card
//     // card.Inuse += quantity;
//     card.Inuse += 1 
//     card.quantity -= 1 // decrease available quantity of that card by 1

//     // Save changes to the database
//     await Promise.all([user.save(), card.save()]);

//     res.status(200).json({ message: 'Card purchased successfully.', user });
//   } catch (error) {
//     console.error('Error purchasing card:', error);
//     res.status(500).json({ message: 'Internal Server Error' });
//   }
// };



