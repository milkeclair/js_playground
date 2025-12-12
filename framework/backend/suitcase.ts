import type { EnhancedRequest, EnhancedResponse } from './type';
import { Pack } from './suitcase/pack';

export type Luggage = (c: { req: EnhancedRequest; res: EnhancedResponse }) => void | Promise<void>;

export function Suitcase() {
  const luggages: Luggage[] = [];

  const put = (luggage: Luggage): void => {
    luggages.push(luggage);
  };

  const zip = async ({
    req,
    res,
  }: {
    req: EnhancedRequest;
    res: EnhancedResponse;
  }): Promise<void> => {
    const packed = Pack(luggages);

    await packed({ req, res });
  };

  return {
    zip,
    put,
  };
}
