import { JwtPayload } from 'jsonwebtoken';
import { Role } from './role.enum';

interface IJwtUserPayload extends JwtPayload {
    _id: string; 
    email: string;
    role: Role; 
}

export default IJwtUserPayload;
