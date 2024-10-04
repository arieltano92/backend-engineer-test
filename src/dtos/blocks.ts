import { Type } from "@sinclair/typebox";

const inputDto = Type.Object({
  txId: Type.String({ minLength: 1 }),
  index: Type.Integer({ minimum: 0 }),
});

const outputDto = Type.Object({
  address: Type.String({ minLength: 2 }),
  value: Type.Number({ minimum: 0 }),
});

const transactionDto = Type.Object({
  id: Type.String({ minLength: 1 }),
  inputs: Type.Array(inputDto),
  outputs: Type.Array(outputDto),
});

export const PostBlockDto = Type.Object({
  id: Type.String({ minLength: 1 }),
  height: Type.Integer({ minimum: 0 }),
  transactions: Type.Array(transactionDto),
});

export const RollbackBlockDto = Type.Object({
    height: Type.Integer({ minimum: 0 }),
});