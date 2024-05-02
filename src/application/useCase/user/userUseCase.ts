

import { UserRequestModel } from "../../../domain/entities/user";
import IUserRepository from "../interface/user/userRepositoryInterface";


class UserUseCase {
    private userRepository: IUserRepository;
   

    constructor(
        userRepository: IUserRepository,
     
    )  {
        this.userRepository = userRepository;
    
    }

    async createUser(user:UserRequestModel)  {
       try {
            const product = await this.userRepository.createUser(user)
            return product
       } catch (error) {
        console.log(error)
       }
    }
    // async getAllProduct () {
    //     try {
    //         const productData = await this.iProductRepository.getAllProduct()
    //         return productData
    //     } catch (error) {
    //         console.log(error)
    //     }
    // }
    // async getSingleProduct (name:string) {
    //     try {
    //         const singleProductData = await this.iProductRepository.getSingleProduct(name)
    //         return singleProductData
    //     } catch (error) {
    //         console.log(error)
    //     }
    // }


}

export default UserUseCase