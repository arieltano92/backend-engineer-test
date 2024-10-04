import { Type } from "@sinclair/typebox";

export const GetBalanceDto = Type.Object({
  address: Type.String({ minLength: 2 }),
});