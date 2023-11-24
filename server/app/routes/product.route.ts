import express from 'express'
import AuthMiddleware from '../middleware/Auth.middleware'
import ProductController from '../controllers/Product.controller'
import { Role } from '../types/role.enum'
import multer from 'multer';

const router = express.Router()

// temporary folder for uploaded files
const upload = multer({ dest: 'uploads/' });

router.get('/get', AuthMiddleware.checkIsEmployeeLoggedIn, ProductController.getAllProduct)
// router.post('/create', AuthMiddleware.checkIsEmployeeLoggedIn, AuthMiddleware.checkIsEmployeeHaveCorrectPermission([Role.WAREHOUSEMAN, Role.MANAGER, Role.SALESMAN]), ProductController.createProduct)
router.post(
  '/create',
  AuthMiddleware.checkIsEmployeeLoggedIn,
  AuthMiddleware.checkIsEmployeeHaveCorrectPermission([Role.WAREHOUSEMAN, Role.MANAGER, Role.SALESMAN]),
  upload.array('photos', 3),
  ProductController.createProduct
);
router.delete('/delete', AuthMiddleware.checkIsEmployeeLoggedIn, AuthMiddleware.checkIsEmployeeHaveCorrectPermission([Role.MANAGER, Role.SALESMAN]), ProductController.deleteProduct)
router.get('/:id', AuthMiddleware.checkIsEmployeeLoggedIn, AuthMiddleware.checkIsEmployeeHaveCorrectPermission([Role.WAREHOUSEMAN, Role.MANAGER, Role.SALESMAN]), ProductController.getSingleProduct)
router.put('/:id', AuthMiddleware.checkIsEmployeeLoggedIn, AuthMiddleware.checkIsEmployeeHaveCorrectPermission([Role.WAREHOUSEMAN, Role.MANAGER, Role.SALESMAN]), ProductController.editProduct)

export default router
