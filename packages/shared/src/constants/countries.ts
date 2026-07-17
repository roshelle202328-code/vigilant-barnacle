export interface CountryConfig {
  code: string;
  name: string;
  currency: string;
  currencySymbol: string;
  locale: string;
  taxIdLabel: string;
  taxIdTypes: Record<string, string>;
  defaultTaxRate: number;
}

export const COUNTRIES: Record<string, CountryConfig> = {
  MEX: {
    code: 'MEX',
    name: 'México',
    currency: 'MXN',
    currencySymbol: '$',
    locale: 'es-MX',
    taxIdLabel: 'RFC',
    taxIdTypes: {
      PERSONA_FISICA: 'Persona Física',
      PERSONA_MORAL: 'Persona Moral',
    },
    defaultTaxRate: 0.16,
  },
  COL: {
    code: 'COL',
    name: 'Colombia',
    currency: 'COP',
    currencySymbol: '$',
    locale: 'es-CO',
    taxIdLabel: 'NIT',
    taxIdTypes: {
      PERSONA_FISICA: 'Persona Natural',
      PERSONA_MORAL: 'Persona Jurídica',
    },
    defaultTaxRate: 0.19,
  },
  CHL: {
    code: 'CHL',
    name: 'Chile',
    currency: 'CLP',
    currencySymbol: '$',
    locale: 'es-CL',
    taxIdLabel: 'RUT',
    taxIdTypes: {
      PERSONA_FISICA: 'Persona Natural',
      PERSONA_MORAL: 'Persona Jurídica',
    },
    defaultTaxRate: 0.19,
  },
  PER: {
    code: 'PER',
    name: 'Perú',
    currency: 'PEN',
    currencySymbol: 'S/',
    locale: 'es-PE',
    taxIdLabel: 'RUC',
    taxIdTypes: {
      PERSONA_FISICA: 'Persona Natural',
      PERSONA_MORAL: 'Persona Jurídica',
    },
    defaultTaxRate: 0.18,
  },
};
