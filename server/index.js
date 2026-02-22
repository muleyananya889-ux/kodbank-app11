const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();

// In-memory storage for demo purposes
let users = [
  {
    id: '1',
    name: 'Test User 1',
    email: 'archanagunje@gmail.com',
    password: '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password: password
    balance: 10000,
    createdAt: new Date()
  },
  {
    id: '2', 
    name: 'Test User 2',
    email: 'test@example.com',
    password: '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password: password
    balance: 10000,
    createdAt: new Date()
  },
  {
    id: '3',
    name: 'Ananya Muley',
    email: 'muleyananya889@gmail.com',
    password: '$2b$10$z5OF5RqXjK7vqyixlr8mRencTl/2Bbohu.Gc0CeL82nyqNIFoeadm', // password: password
    balance: 10000,
    createdAt: new Date()
  }
];

app.use(cors());
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || 'fallbacksecret';

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

app.post('/api/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const existingUser = users.find(u => u.email === email);

    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = {
      id: Date.now().toString(),
      name,
      email,
      password: hashedPassword,
      balance: 10000,
      createdAt: new Date()
    };

    users.push(user);

    res.status(201).json({ 
      message: 'User created successfully',
      user: { id: user.id, name: user.name, email: user.email }
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = users.find(u => u.email === email);

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: { id: user.id, name: user.name, email: user.email }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/balance', authenticateToken, async (req, res) => {
  try {
    const user = users.find(u => u.id === req.user.userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ balance: user.balance });
  } catch (error) {
    console.error('Balance error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/transfer', authenticateToken, async (req, res) => {
  try {
    const { receiverEmail, amount } = req.body;

    if (!receiverEmail || !amount) {
      return res.status(400).json({ error: 'Receiver email and amount are required' });
    }

    if (amount <= 0) {
      return res.status(400).json({ error: 'Amount must be positive' });
    }

    const sender = users.find(u => u.id === req.user.userId);
    const receiver = users.find(u => u.email === receiverEmail);

    if (!sender) {
      return res.status(404).json({ error: 'Sender not found' });
    }

    if (sender.balance < amount) {
      return res.status(400).json({ error: 'Insufficient balance' });
    }

    if (!receiver) {
      return res.status(400).json({ error: 'Receiver not found' });
    }

    if (sender.id === receiver.id) {
      return res.status(400).json({ error: 'Cannot transfer to yourself' });
    }

    // Update balances
    sender.balance -= amount;
    receiver.balance += amount;

    res.json({
      message: 'Transfer successful',
      amount,
      receiverEmail,
      newBalance: sender.balance
    });
  } catch (error) {
    console.error('Transfer error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
