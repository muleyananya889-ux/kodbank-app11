// Mock API for Vercel deployment (frontend-only)
const mockUsers = [
  {
    id: '1',
    name: 'Test User 1',
    email: 'archanagunje@gmail.com',
    password: 'password',
    balance: 10000,
    createdAt: new Date()
  },
  {
    id: '2', 
    name: 'Test User 2',
    email: 'test@example.com',
    password: 'password',
    balance: 10000,
    createdAt: new Date()
  },
  {
    id: '3',
    name: 'Ananya Muley',
    email: 'muleyananya889@gmail.com',
    password: 'password',
    balance: 10000,
    createdAt: new Date()
  }
];

const mockApi = {
  post: async (url, data) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (url === '/api/signup') {
      const existingUser = mockUsers.find(u => u.email === data.email);
      if (existingUser) {
        throw { response: { data: { error: 'User already exists' } } };
      }
      const newUser = {
        id: Date.now().toString(),
        name: data.name,
        email: data.email,
        balance: 10000
      };
      mockUsers.push(newUser);
      return { data: { message: 'User created successfully', user: newUser } };
    }
    
    if (url === '/api/login') {
      const user = mockUsers.find(u => u.email === data.email && u.password === data.password);
      if (!user) {
        throw { response: { data: { error: 'Invalid credentials' } } };
      }
      const token = 'mock-jwt-token-' + Date.now();
      return { 
        data: { 
          token, 
          user: { id: user.id, name: user.name, email: user.email } 
        } 
      };
    }
    
    if (url === '/api/transfer') {
      const sender = mockUsers.find(u => u.email === 'muleyananya889@gmail.com');
      const receiver = mockUsers.find(u => u.email === data.receiverEmail);
      
      if (!receiver) {
        throw { response: { data: { error: 'Receiver not found' } } };
      }
      
      if (sender.balance < data.amount) {
        throw { response: { data: { error: 'Insufficient balance' } } };
      }
      
      sender.balance -= data.amount;
      receiver.balance += data.amount;
      
      return { data: { message: 'Transfer successful' } };
    }
  },
  
  get: async (url, config) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (url === '/api/balance') {
      const user = mockUsers.find(u => u.email === 'muleyananya889@gmail.com');
      return { data: { balance: user.balance } };
    }
  }
};

export default mockApi;
