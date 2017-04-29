/*

Queue.js

A function to represent a queue

Created by Stephen Morley - http://code.stephenmorley.org/ - and released under
the terms of the CC0 1.0 Universal legal code:

http://creativecommons.org/publicdomain/zero/1.0/legalcode

*/

/* Creates a new queue. A queue is a first-in-first-out (FIFO) data structure -
 * items are added to the end of the queue and removed from the front.
 */

export interface IQueue {
  getLength(): number;
  enqueue(item: any): Promise<any>;
  dequeue(): any;
  peek(): any;
  isEmpty(): boolean;
}

export class Queue implements IQueue {
  getLength(): number {
    throw new Error("Method not implemented.");
  }
  enqueue(item: any): Promise<any> {
    throw new Error("Method not implemented. " + item);
  }
  dequeue() {
    throw new Error("Method not implemented.");
  }
  peek() {
    throw new Error("Method not implemented.");
  }
  isEmpty(): boolean {
    throw new Error("Method not implemented.");
  }

  constructor() {
    // initialise the queue and offset
    var queue: any[] = [];
    var offset = 0;

    // Returns the length of the queue.
    this.getLength = () => queue.length - offset;

    // Returns true if the queue is empty, and false otherwise.
    this.isEmpty = () => queue.length == 0;

    /* Enqueues the specified item. The parameter is:
     *
     * item - the item to enqueue
     */
    this.enqueue = (item: any) => {
      queue.push(item);
      return Promise.resolve()
    }

    /* Dequeues an item and returns it. If the queue is empty, the value
     * 'undefined' is returned.
     */
    this.dequeue = function () {

      // if the queue is empty, return immediately
      if (queue.length == 0) return undefined;

      // store the item at the front of the queue
      var item = queue[offset];

      // increment the offset and remove the free space if necessary
      if (++offset * 2 >= queue.length) {
        queue = queue.slice(offset);
        offset = 0;
      }

      // return the dequeued item
      return item;

    }

    /* Returns the item at the front of the queue (without dequeuing it). If the
     * queue is empty then undefined is returned.
     */
    this.peek = function () {
      return (queue.length > 0 ? queue[offset] : undefined);
    }
  }
}