import prisma from '../config/db.config';
import { Request, Response } from 'express';
import CustomRequest from '../typescript/interface';
import { orderItem } from '../typescript/types';

const createOrder = async (req: CustomRequest, res: Response): Promise<any> => {
  let { items } = req.body;
  const userId = req.user.id;
  if (!items || items.length === 0) {
    return res
      .status(400)
      .json({ error: 'Order must contain at least one item' });
  }

  try {
    const transaction = await prisma.$transaction(async (prisma) => {
      let total = 0;
      // Validate and calculate the total for each item
      const resolvedItems = await Promise.all(
        items.map(async (item: orderItem) => {
          const grocery = await prisma.grocery.findUnique({
            where: { id: item.groceryId },
            select: { price: true, inventory: true, name: true },
          });

          if (!grocery || !grocery.inventory) {
            throw new Error(`Grocery with id ${item.groceryId} not found`);
          }

          if (grocery.inventory.stock < item.quantity) {
            throw new Error(`Not enough stock for ${grocery.name}`);
          }

          // Use grocery price to calculate the total
          total += grocery.price * item.quantity;

          // Return the item with the price added
          return {
            groceryId: item.groceryId,
            quantity: item.quantity,
            price: grocery.price, // Use the price from the grocery data
          };
        }),
      );

      const order = await prisma.order.create({
        data: {
          userId,
          total,
          items: {
            create: resolvedItems,
          },
        },
      });

      const inventoryUpdates = items.map((item: orderItem) => {
        return prisma.inventory.update({
          where: { groceryId: item.groceryId },
          data: {
            stock: { decrement: item.quantity }, // Reduce the stock by the order quantity
          },
        });
      });

      await Promise.all(inventoryUpdates);

      return order;
    });

    return res.status(201).json({
      message: 'Order created successfully',
      order: transaction,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getOrders = async (req: CustomRequest, res: Response): Promise<any> => {
  try {
    const orders = await prisma.order.findMany({
      where: {
        userId: req.user.id,
      },
      include: {
        items: {
          select: {
            id: true,
            price: true,
            quantity: true,
            Grocery: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    return res.status(200).json({ orders });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getOrderById = async (req: Request, res: Response): Promise<any> => {
  const { id } = req.params;

  try {
    const order = await prisma.order.findUnique({
      where: { id: Number(id) },
      include: {
        items: {
          select: {
            id: true,
            price: true,
            quantity: true,
            Grocery: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    return res.status(200).json({ order });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

export default {
  createOrder,
  getOrders,
  getOrderById,
};
