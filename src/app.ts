import JWT from './jwt';

const mockClaims = { sub: '1', username: 'admin', exp: 1699971962 };

export const startApp = async ({
  jwtSecret,
}: {
  jwtSecret: string;
}) => {
  const jwt = JWT.new(jwtSecret);

  try {
    const generatedToken = jwt.generate(mockClaims);
    console.log('Generated token:', generatedToken);
  
    const claimsResult = jwt.getClaims(generatedToken);
    console.log('Claims:', claimsResult);
  
    const isValid = jwt.validate(generatedToken);
    console.log('Is valid:', isValid);
  } catch (error) {
    console.error(error);
  }
}
