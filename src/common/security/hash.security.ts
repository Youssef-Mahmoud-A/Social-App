import bcrypt from 'bcrypt'
import { SALT } from '../../config'

export const hash = async (plaintext: string, salt_round: number = SALT, minor: 'a' | 'b' = "b"): Promise<string> => {
    const saltSignature = await bcrypt.genSalt(salt_round, minor);
    return await bcrypt.hash(plaintext, saltSignature);
}

export const compare = async (plaintext: string, cipherText: string): Promise<boolean> => {
    return await bcrypt.compare(plaintext, cipherText);
}