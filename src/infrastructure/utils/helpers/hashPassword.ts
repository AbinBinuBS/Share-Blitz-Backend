
import crypto from 'crypto'
import HashPasswordInterface from '../../../domain/interface/helpers/hashPasswordInterface';
class hashPassword implements HashPasswordInterface{
    // async createHash(password: string): Promise<string> {
    //     const hashedPassword=await bcrypt.hash(password,10)
    //     return hashedPassword
    // }
    async compare(password: string, hashedPassword: string): Promise<boolean> {
        const newHashedPassword = await this.createHash(password);
        // Compare the newly generated hash with the stored hashed password
        return crypto.timingSafeEqual(Buffer.from(hashedPassword, 'utf-8'), Buffer.from(newHashedPassword, 'utf-8'));
    }

    async createHash(password:string) : Promise<string> {
        const hashedPassword = crypto.pbkdf2Sync(password, '10', 10000, 64, 'sha512').toString('hex');
        console.log(hashedPassword)
        return hashedPassword
    }
}

export default hashPassword