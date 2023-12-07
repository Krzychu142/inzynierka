import express from 'express'
import AuthMiddleware from '../middleware/Auth.middleware'
import ProductController from '../controllers/Product.controller'
import { Role } from '../types/role.enum'
import multer from 'multer'

const router = express.Router()

const upload = multer({ storage: multer.memoryStorage() })

router.get(
  '/get',
  AuthMiddleware.checkIsEmployeeLoggedIn,
  ProductController.getAllProduct,
)

router.post(
  '/create',
  AuthMiddleware.checkIsEmployeeLoggedIn,
  AuthMiddleware.checkIsEmployeeHaveCorrectPermission([
    Role.WAREHOUSEMAN,
    Role.MANAGER,
    Role.SALESMAN,
  ]),
  ProductController.createProduct,
)

router.delete(
  '/delete',
  AuthMiddleware.checkIsEmployeeLoggedIn,
  AuthMiddleware.checkIsEmployeeHaveCorrectPermission([
    Role.MANAGER,
    Role.SALESMAN,
  ]),
  ProductController.deleteProduct,
)

router.get(
  '/:id',
  AuthMiddleware.checkIsEmployeeLoggedIn,
  AuthMiddleware.checkIsEmployeeHaveCorrectPermission([
    Role.WAREHOUSEMAN,
    Role.MANAGER,
    Role.SALESMAN,
  ]),
  ProductController.getSingleProduct,
)

router.put(
  '/:id',
  AuthMiddleware.checkIsEmployeeLoggedIn,
  AuthMiddleware.checkIsEmployeeHaveCorrectPermission([
    Role.WAREHOUSEMAN,
    Role.MANAGER,
    Role.SALESMAN,
  ]),
  ProductController.editProduct,
)

router.put(
  '/uploadImageToProduct/:id',
  AuthMiddleware.checkIsEmployeeLoggedIn,
  AuthMiddleware.checkIsEmployeeHaveCorrectPermission([
    Role.WAREHOUSEMAN,
    Role.MANAGER,
    Role.SALESMAN,
  ]),
  upload.single('image'),
  ProductController.uploadImageToProduct,
)

router.delete(
  '/deleteImageByURL',
  AuthMiddleware.checkIsEmployeeLoggedIn,
  AuthMiddleware.checkIsEmployeeHaveCorrectPermission([
    Role.WAREHOUSEMAN,
    Role.MANAGER,
    Role.SALESMAN,
  ]),
  ProductController.deleteImageByURL,
)

export default router
