import { InputSchema } from 'elysia';

export type ParamsSchema = InputSchema<never>['params'];
export type BodySchema = InputSchema<never>['body'];
export type ResponseSchema = InputSchema<never>['response'];

export interface IResponseSchema {
  toResponseSchema(): Exclude<InputSchema<never>['body'], undefined>;
}

export interface IBodySchema {
  toBodySchema(): Exclude<InputSchema<never>['body'], undefined>;
}