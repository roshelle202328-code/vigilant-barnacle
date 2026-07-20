export class Company {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly taxId: string,
    public readonly country: string,
    public readonly subscriptionTier: string,
    public readonly active: boolean,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}
}
