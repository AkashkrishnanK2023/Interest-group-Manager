// Mock database implementation for development without MongoDB
interface MockUser {
  _id: string;
  email: string;
  password: string;
  name: string;
  createdAt: Date;
}

interface MockGroup {
  _id: string;
  title: string;
  description: string;
  category: string;
  visibility: "public" | "private";
  adminId: string;
  adminName: string;
  memberCount: number;
  createdAt: Date;
}

interface MockMembership {
  _id: string;
  userId: string;
  userName: string;
  groupId: string;
  status: "approved" | "pending";
  joinedAt: Date;
}

// In-memory storage - using global to persist across requests
declare global {
  var mockUsers: MockUser[] | undefined;
  var mockGroups: MockGroup[] | undefined;
  var mockMemberships: MockMembership[] | undefined;
  var mockIdCounter: number | undefined;
}

// Initialize global storage
if (!global.mockUsers) {
  global.mockUsers = [];
}
if (!global.mockGroups) {
  global.mockGroups = [];
}
if (!global.mockMemberships) {
  global.mockMemberships = [];
}
if (!global.mockIdCounter) {
  global.mockIdCounter = 1;
}

const users = global.mockUsers;
const groups = global.mockGroups;
const memberships = global.mockMemberships;
let idCounter = global.mockIdCounter;

// Mock collection interface
class MockCollection {
  private data: any[];
  
  constructor(data: any[]) {
    this.data = data;
  }

  private matchesQuery(item: any, query: any): boolean {
    return Object.keys(query).every(key => {
      if (key === '$or') {
        return query[key].some((orQuery: any) => this.matchesQuery(item, orQuery));
      }
      
      const queryValue = query[key];
      const itemValue = item[key];
      
      if (typeof queryValue === 'object' && queryValue !== null) {
        if (queryValue.$regex) {
          const regex = new RegExp(queryValue.$regex, queryValue.$options || '');
          return regex.test(itemValue);
        }
      }
      
      return itemValue === queryValue;
    });
  }

  async findOne(query: any) {
    return this.data.find(item => this.matchesQuery(item, query)) || null;
  }

  async find(query: any = {}) {
    const results = this.data.filter(item => this.matchesQuery(item, query));
    return {
      sort: (sortQuery: any) => ({
        toArray: async () => {
          if (Object.keys(sortQuery).length === 0) return results;
          
          return results.sort((a, b) => {
            for (const [key, direction] of Object.entries(sortQuery)) {
              const aVal = a[key];
              const bVal = b[key];
              
              if (aVal < bVal) return direction === 1 ? -1 : 1;
              if (aVal > bVal) return direction === 1 ? 1 : -1;
            }
            return 0;
          });
        }
      }),
      toArray: async () => results
    };
  }

  async insertOne(doc: any) {
    const newDoc = {
      ...doc,
      _id: (idCounter++).toString()
    };
    this.data.push(newDoc);
    global.mockIdCounter = idCounter; // Update global counter
    return {
      insertedId: newDoc._id
    };
  }

  async updateOne(query: any, update: any) {
    const index = this.data.findIndex(item => {
      return Object.keys(query).every(key => item[key] === query[key]);
    });
    
    if (index !== -1) {
      if (update.$set) {
        this.data[index] = { ...this.data[index], ...update.$set };
      }
      return { modifiedCount: 1 };
    }
    return { modifiedCount: 0 };
  }

  async deleteOne(query: any) {
    const index = this.data.findIndex(item => {
      return Object.keys(query).every(key => item[key] === query[key]);
    });
    
    if (index !== -1) {
      this.data.splice(index, 1);
      return { deletedCount: 1 };
    }
    return { deletedCount: 0 };
  }
}

// Mock database interface
class MockDb {
  collection(name: string) {
    switch (name) {
      case 'users':
        return new MockCollection(users);
      case 'groups':
        return new MockCollection(groups);
      case 'memberships':
        return new MockCollection(memberships);
      default:
        return new MockCollection([]);
    }
  }
}

export function getMockDatabase() {
  return new MockDb();
}

// Initialize with some sample data including admin user
if (users.length === 0) {
  console.log('🔧 Using mock database for development');
  
  // Add admin user to mock database
  const bcrypt = require('bcryptjs');
  const adminPasswordHash = bcrypt.hashSync('admin123', 12);
  
  users.push({
    _id: 'admin_user_id',
    email: 'admin',
    password: adminPasswordHash,
    name: 'Administrator',
    createdAt: new Date()
  });
  
  // Add sample groups to mock database
  const sampleGroups = [
    {
      _id: '1',
      title: 'React Developers',
      description: 'A community for React developers to share knowledge, discuss best practices, and collaborate on projects.',
      category: 'Technology',
      visibility: 'public',
      adminId: 'admin_user_id',
      adminName: 'Administrator',
      memberCount: 1,
      createdAt: new Date('2024-01-15T10:00:00.000Z'),
    },
    {
      _id: '2',
      title: 'Photography Enthusiasts',
      description: 'Share your photos, get feedback, and learn new techniques from fellow photography lovers.',
      category: 'Art',
      visibility: 'public',
      adminId: 'admin_user_id',
      adminName: 'Administrator',
      memberCount: 1,
      createdAt: new Date('2024-01-20T14:30:00.000Z'),
    },
    {
      _id: '3',
      title: 'Local Hiking Group',
      description: 'Join us for weekend hikes and outdoor adventures in the local area. All skill levels welcome!',
      category: 'Sports',
      visibility: 'private',
      adminId: 'admin_user_id',
      adminName: 'Administrator',
      memberCount: 1,
      createdAt: new Date('2024-01-25T09:15:00.000Z'),
    },
    {
      _id: '4',
      title: 'Movie Night Club',
      description: 'Weekly movie screenings and discussions. We explore different genres from classic cinema to latest releases.',
      category: 'Entertainment',
      visibility: 'public',
      adminId: 'admin_user_id',
      adminName: 'Administrator',
      memberCount: 1,
      createdAt: new Date('2024-01-28T19:00:00.000Z'),
    },
    {
      _id: '5',
      title: 'Home Bakers Guild',
      description: 'Share baking recipes, techniques, and photos of your creations. From bread to pastries, all skill levels welcome.',
      category: 'Food',
      visibility: 'public',
      adminId: 'admin_user_id',
      adminName: 'Administrator',
      memberCount: 1,
      createdAt: new Date('2024-02-05T16:00:00.000Z'),
    },
    {
      _id: '6',
      title: 'Startup Founders Network',
      description: 'Connect with fellow entrepreneurs, share experiences, discuss challenges, and support each other\'s ventures.',
      category: 'Business',
      visibility: 'public',
      adminId: 'admin_user_id',
      adminName: 'Administrator',
      memberCount: 1,
      createdAt: new Date('2024-02-02T09:15:00.000Z'),
    }
  ];
  
  groups.push(...sampleGroups);
  
  console.log('🔧 Admin user and sample groups added to mock database');
}