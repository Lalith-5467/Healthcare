import { prisma } from '../config/prisma';
import { emitOrderStatusUpdate } from '../socket';

async function main() {
  const order = await prisma.pharmacyOrder.update({
    where: { id: 'cmtjz2gu60007i010kj1v5aen' },
    data: {
      status: 'PENDING' as any,
      totalAmount: 422.0,
      orderedAt: new Date(),
    },
    include: { patient: true, pharmacy: true },
  });

  console.log('✓ Successfully reset order to PENDING:', order.id, 'Status:', order.status);

  emitOrderStatusUpdate({
    orderId: order.id,
    patientId: order.patientId,
    pharmacyId: order.pharmacyId,
    status: 'PENDING',
    previousStatus: 'NEW',
    updatedAt: new Date().toISOString(),
    message: `🔔 New Prescription Order received from ${order.patient?.fullName || 'Akshara'} (#${order.id})`,
  });

  console.log('✓ Emitted real-time PENDING event to Socket.IO rooms.');
}

main().finally(() => prisma.$disconnect());
