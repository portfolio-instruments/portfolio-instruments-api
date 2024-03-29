import type { Response } from 'express';
import type { PatchAccountRequest, DeleteAccountRequest, PutAccountRequest } from './account.request.schema';
import { queryAbleAccountKeys, type CreateAccountRequest, type GetAccountRequest } from './account.request.schema';
import type { CreateAccountContext, UpdateAccountContext } from './account.service';
import { createAccount, deleteAccount, updateAccount, getAccountById, getAccounts } from './account.service';
import type { ValidUserRequest } from '../../middleware/deserializeUser';
import { nonNullValue } from '../../utils/nonNull';
import type { Account } from '@prisma/client';
import ApiError from '../../errors/ApiError';
import type { ParsedQuery } from '../../utils/parseQuery';
import { parseQuery } from '../../utils/parseQuery';
import type { BaseRequest } from '../../BaseRequest';

/** Create */
/**
 * @openapi
 * components:
 *  schemas:
 *    CreateAccountResponse:
 *      type: object
 *      properties:
 *        id:
 *          type: number
 *        userId:
 *          type: number
 *        institution:
 *          type: string
 *        taxShelter:
 *          type: string
 *        description:
 *          type: string
 *        active:
 *          type: boolean
 *        createdAt:
 *          type: string
 *          format: date-time
 *        updatedAt:
 *          type: string
 *          format: date-time
 */
type CreateAccountHandlerRequest = BaseRequest & ValidUserRequest & CreateAccountRequest;

async function createAccountHandler(req: CreateAccountHandlerRequest, res: Response): Promise<void> {
  const userId: number = nonNullValue(req.user?.id);
  const context: CreateAccountContext = { ...req.body, userId };
  const account: Account = await createAccount(context);
  res.status(201).json(account);
}

/** Read */
/**
 * @openapi
 * components:
 *   schemas:
 *     Account:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         userId:
 *           type: integer
 *         institution:
 *           type: string
 *         taxShelter:
 *           type: string
 *         description:
 *           type: string
 *         active:
 *           type: boolean
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *
 *     GetAccountsResponse:
 *       type: array
 *       items:
 *         $ref: '#/components/schemas/Account'
 */
type GetAccountsHandlerRequest = BaseRequest & ValidUserRequest;

async function getAccountsHandler(req: GetAccountsHandlerRequest, res: Response): Promise<void> {
  const parsedQuery: ParsedQuery = parseQuery(req, queryAbleAccountKeys);
  const userId: number = nonNullValue(req.user?.id);
  const accounts: Account[] = await getAccounts(userId, parsedQuery);
  res.status(200).json(accounts);
}

type GetAccountByIdHandlerRequest = BaseRequest & ValidUserRequest & GetAccountRequest;

async function getAccountByIdHandler(req: GetAccountByIdHandlerRequest, res: Response): Promise<void> {
  const userId: number = nonNullValue(req.user?.id);
  const accountId: number = Number(req.params.accountId);

  const account: Account | null = await getAccountById(userId, accountId);
  if (!account) {
    throw ApiError.notFound(`Account not found.`);
  }

  res.status(200).json(account);
}

/** Update */
type PatchAccountByIdHandlerRequest = BaseRequest & ValidUserRequest & PatchAccountRequest;
type PutAccountByIdHandlerRequest = BaseRequest & ValidUserRequest & PutAccountRequest;
type UpdateAccountByIdHandlerRequest = PatchAccountByIdHandlerRequest | PutAccountByIdHandlerRequest;

async function updateAccountByIdHandler(req: UpdateAccountByIdHandlerRequest, res: Response): Promise<void> {
  const userId: number = nonNullValue(req.user?.id);
  const context: UpdateAccountContext = {
    ...req.body,
    id: Number(req.params.accountId),
  };

  /**
   * Check if we can update the resource
   * (Prisma doesn't seem to allow us to bundle the 'where' condition, so check manually)
   */
  const peekAccount: Account | null = await getAccountById(userId, context.id);
  if (!peekAccount) {
    throw ApiError.notFound(`Account was not found.`);
  } else if (peekAccount.userId !== userId) {
    throw ApiError.forbidden(`Account does not belong to the current user.`);
  }

  /** Update the resource */
  const account = await updateAccount(context);
  res.status(200).json(account);
}

/** Delete */
type DeleteAccountByIdHandlerRequest = BaseRequest & ValidUserRequest & DeleteAccountRequest;

async function deleteAccountByIdHandler(req: DeleteAccountByIdHandlerRequest, res: Response): Promise<void> {
  const userId: number = nonNullValue(req.user?.id);
  const accountId: number = Number(req.params.accountId);

  /**
   * Check if we can delete the resource
   * (Prisma doesn't seem to allow us to bundle the 'where' condition, so check manually)
   */
  const peekAccount: Account | null = await getAccountById(userId, accountId);
  if (!peekAccount) {
    throw ApiError.notFound(`Account was not found.`);
  } else if (peekAccount.userId !== userId) {
    throw ApiError.forbidden(`Account does not belong to the current user.`);
  }

  await deleteAccount(accountId);
  res.status(204).json();
}

export default {
  getAccountsHandler,
  getAccountByIdHandler,
  createAccountHandler,
  updateAccountByIdHandler,
  deleteAccountByIdHandler,
};
