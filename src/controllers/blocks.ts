import type { FastifyRequestType, FastifyReplyType } from "fastify/types/type-provider";
import { processBlock, rollbackToHeightBlock, validateBlock } from "../services/blocks";
import type { Block, HeightQueryParam } from "../types";

export async function postBlock(request: FastifyRequestType, _reply: FastifyReplyType) {
    const block = request.body as Block;
    await validateBlock(block)
    await processBlock(block)
    return { success: true, message: "Block was processed successfully!" }
};

export async function rollbackBlockByHeight(request: FastifyRequestType, _reply: FastifyReplyType) {
    const {height} = request.query as HeightQueryParam;
    await rollbackToHeightBlock(height)
    return { success: true, message: "Rollback was processed successfully!" }
};