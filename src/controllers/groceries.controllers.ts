import { Request, Response } from 'express';
import prisma from '../config/db.config'; // Assuming you're using Prisma ORM

// Create a new grocery item along with its inventory
const create = async (req: Request, res: Response): Promise<any> => {
    const { name, price, stock } = req.body;
  
    if (!name || !price || stock === undefined) {
      return res.status(400).json({ error: 'Name, price, and stock are required' });
    }
  
    try {
       // Upsert the grocery item by name
    const grocery = await prisma.grocery.upsert({
        where: {
          name, // Use name as the unique identifier for grocery
        },
        update: {
          price, // Update the price if the grocery already exists
          inventory: {
            upsert: {
              where: {
                groceryId: undefined, // This references the existing grocery
              },
              update: {
                stock: {
                  increment: stock, // Increment stock if inventory exists
                },
              },
              create: {
                stock,
                sold: 0,
              },
            },
          },
        },
        create: {
          name,
          price,
          inventory: {
            create: {
              stock,
              sold: 0,
            },
          },
        },
      });
  
      return res.status(201).json({
        message: 'Grocery created or updated successfully with inventory',
        grocery,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  
  

// Get all groceries (accessible by everyone)
const getAll = async (_req: Request, res: Response): Promise<any> => {
  try {
    const groceries = await prisma.grocery.findMany({
      include: {
        inventory: true, // Include inventory data with each grocery
      },
    });
    return res.status(200).json(groceries);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Get a single grocery item by ID (accessible by everyone)
const getOne = async (req: Request, res: Response): Promise<any> => {
  const { id } = req.params;

  try {
    const grocery = await prisma.grocery.findUnique({
      where: { id: Number(id) },
      include: {
        inventory: true, // Include inventory data with the grocery
      },
    });

    if (!grocery) {
      return res.status(404).json({ error: 'Grocery item not found' });
    }
    return res.status(200).json(grocery);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Update a grocery item and its inventory
const update = async (req: Request, res: Response): Promise<any> => {
  const { id } = req.params;
  const { name, price, stock } = req.body;

  if (stock === undefined) {
    return res.status(400).json({ error: 'Stock is required to update inventory' });
  }

  try {
    // Check if the name already exists (except for the current grocery)
    if (name) {
        const existingGrocery = await prisma.grocery.findUnique({
          where: { name },
        });
  
        if (existingGrocery && existingGrocery.id !== Number(id)) {
          return res.status(400).json({ error: 'Name is already taken' });
        }
    }    
    const grocery = await prisma.grocery.update({
      where: { id: Number(id) },
      data: {
        name,
        price,
        inventory: {
          update: { stock },
        },
      },
      include: {
        inventory: true, // Include updated inventory data with the grocery
      },
    });

    return res.status(200).json({
      message: 'Grocery updated successfully with new inventory',
      grocery,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Update the stock of a grocery item (just the inventory)
const updateStock = async (req: Request, res: Response): Promise<any> => {
  const { id } = req.params;
  const { stock } = req.body;

  if (stock === undefined) {
    return res.status(400).json({ error: 'Stock is required' });
  }

  try {
    const grocery = await prisma.inventory.update({
      where: { groceryId: Number(id) },
      data: { stock },
    });

    return res.status(200).json({
      message: 'Stock updated successfully',
      inventory: grocery,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Delete a grocery item and its inventory
const deleteGrocery = async (req: Request, res: Response): Promise<any> => {
  const { id } = req.params;

  try {
    await prisma.grocery.delete({
      where: { id: Number(id) },
    });
    return res.status(200).json({ message: 'Grocery deleted successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

export default {
  create,
  getAll,
  getOne,
  update,
  updateStock,
  delete: deleteGrocery,
};
