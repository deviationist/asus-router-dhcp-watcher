import eventEmitter from '@worker/lib/event';
import ClientConnectedEvent from '@worker/events/client/connected';
import ClientDisconnectedEvent from '@worker/events/client/disconnected';

eventEmitter.on('client:connected', ClientConnectedEvent);
eventEmitter.on('client:disconnected', ClientDisconnectedEvent);