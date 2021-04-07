export interface Entry {
  messageId: string;
  receiptHandle: string;
}

export interface BatchModel {
  queueUrl: string;
  entries: Entry[];
}
