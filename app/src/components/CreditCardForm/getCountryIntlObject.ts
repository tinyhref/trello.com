import { intl } from '@trello/i18n';

/**
 * Gets the localized country name for a given country code
 * @param countryCode - The ISO 3166-1 alpha-2 country code (e.g. 'US', 'GB')
 * @returns The localized country name string
 */
export const getCountryIntlObject = (countryCode: string) => {
  switch (countryCode) {
    // Special
    case 'US':
      return intl.formatMessage({
        id: 'templates.credit_card.countries.united-states',
        defaultMessage: 'United States',
        description: 'United States',
      });
    case 'GB':
      return intl.formatMessage({
        id: 'templates.credit_card.countries.united-kingdom',
        defaultMessage: 'United Kingdom',
        description: 'United Kingdom',
      });
    case 'CA':
      return intl.formatMessage({
        id: 'templates.credit_card.countries.canada',
        defaultMessage: 'Canada',
        description: 'Canada',
      });
    case 'AU':
      return intl.formatMessage({
        id: 'templates.credit_card.countries.australia',
        defaultMessage: 'Australia',
        description: 'Australia',
      });
    case 'DE':
      return intl.formatMessage({
        id: 'templates.credit_card.countries.germany',
        defaultMessage: 'Germany',
        description: 'Germany',
      });
    case 'NL':
      return intl.formatMessage({
        id: 'templates.credit_card.countries.netherlands',
        defaultMessage: 'Netherlands',
        description: 'Netherlands',
      });
    // Unloved
    case 'AF':
      return intl.formatMessage({
        id: 'templates.credit_card.countries.afghanistan',
        defaultMessage: 'Afghanistan',
        description: 'Afghanistan',
      });
    case 'AX':
      return intl.formatMessage({
        id: 'templates.credit_card.countries.aland',
        defaultMessage: 'Åland',
        description: 'Åland',
      });
    case 'AL':
      return intl.formatMessage({
        id: 'templates.credit_card.countries.albania',
        defaultMessage: 'Albania',
        description: 'Albania',
      });
    case 'DZ':
      return intl.formatMessage({
        id: 'templates.credit_card.countries.algeria',
        defaultMessage: 'Algeria',
        description: 'Algeria',
      });
    case 'AS':
      return intl.formatMessage({
        id: 'templates.credit_card.countries.american-samoa',
        defaultMessage: 'American Samoa',
        description: 'American Samoa',
      });
    case 'AD':
      return intl.formatMessage({
        id: 'templates.credit_card.countries.andorra',
        defaultMessage: 'Andorra',
        description: 'Andorra',
      });
    case 'AO':
      return intl.formatMessage({
        id: 'templates.credit_card.countries.angola',
        defaultMessage: 'Angola',
        description: 'Angola',
      });
    case 'AI':
      return intl.formatMessage({
        id: 'templates.credit_card.countries.anguilla',
        defaultMessage: 'Anguilla',
        description: 'Anguilla',
      });
    case 'AQ':
      return intl.formatMessage({
        id: 'templates.credit_card.countries.antarctica',
        defaultMessage: 'Antarctica',
        description: 'Antarctica',
      });
    case 'AG':
      return intl.formatMessage({
        id: 'templates.credit_card.countries.antiqua-and-barbuda',
        defaultMessage: 'Antiqua and Barbuda',
        description: 'Antiqua and Barbuda',
      });
    case 'AR':
      return intl.formatMessage({
        id: 'templates.credit_card.countries.argentina',
        defaultMessage: 'Argentina',
        description: 'Argentina',
      });
    case 'AM':
      return intl.formatMessage({
        id: 'templates.credit_card.countries.armenia',
        defaultMessage: 'Armenia',
        description: 'Armenia',
      });
    case 'AW':
      return intl.formatMessage({
        id: 'templates.credit_card.countries.aruba',
        defaultMessage: 'Aruba',
        description: 'Aruba',
      });
    case 'AT':
      return intl.formatMessage({
        id: 'templates.credit_card.countries.austria',
        defaultMessage: 'Austria',
        description: 'Austria',
      });
    case 'AZ':
      return intl.formatMessage({
        id: 'templates.credit_card.countries.azerbaijan',
        defaultMessage: 'Azerbaijan',
        description: 'Azerbaijan',
      });
    case 'BS':
      return intl.formatMessage({
        id: 'templates.credit_card.countries.bahamas',
        defaultMessage: 'Bahamas',
        description: 'Bahamas',
      });
    case 'BH':
      return intl.formatMessage({
        id: 'templates.credit_card.countries.bahrain',
        defaultMessage: 'Bahrain',
        description: 'Bahrain',
      });
    case 'BD':
      return intl.formatMessage({
        id: 'templates.credit_card.countries.bangladesh',
        defaultMessage: 'Bangladesh',
        description: 'Bangladesh',
      });
    case 'BB':
      return intl.formatMessage({
        id: 'templates.credit_card.countries.barbados',
        defaultMessage: 'Barbados',
        description: 'Barbados',
      });
    case 'BE':
      return intl.formatMessage({
        id: 'templates.credit_card.countries.belgium',
        defaultMessage: 'Belgium',
        description: 'Belgium',
      });
    case 'BZ':
      return intl.formatMessage({
        id: 'templates.credit_card.countries.belize',
        defaultMessage: 'Belize',
        description: 'Belize',
      });
    case 'BJ':
      return intl.formatMessage({
        id: 'templates.credit_card.countries.benin',
        defaultMessage: 'Benin',
        description: 'Benin',
      });
    case 'BM':
      return intl.formatMessage({
        id: 'templates.credit_card.countries.bermuda',
        defaultMessage: 'Bermuda',
        description: 'Bermuda',
      });
    case 'BT':
      return intl.formatMessage({
        id: 'templates.credit_card.countries.bhutan',
        defaultMessage: 'Bhutan',
        description: 'Bhutan',
      });
    case 'BO':
      return intl.formatMessage({
        id: 'templates.credit_card.countries.bolivia',
        defaultMessage: 'Bolivia',
        description: 'Bolivia',
      });
    case 'BQ':
      return intl.formatMessage({
        id: 'templates.credit_card.countries.bonaire-sint-eustatius-and-saba',
        defaultMessage: 'Bonaire, Sint Eustatius and Saba',
        description: 'Bonaire, Sint Eustatius and Saba',
      });
    case 'BA':
      return intl.formatMessage({
        id: 'templates.credit_card.countries.bosnia-herzegovina',
        defaultMessage: 'Bosnia-Herzegovina',
        description: 'Bosnia-Herzegovina',
      });
    case 'BW':
      return intl.formatMessage({
        id: 'templates.credit_card.countries.botswana',
        defaultMessage: 'Botswana',
        description: 'Botswana',
      });
    case 'BV':
      return intl.formatMessage({
        id: 'templates.credit_card.countries.bouvet-islands',
        defaultMessage: 'Bouvet Islands',
        description: 'Bouvet Islands',
      });
    case 'BR':
      return intl.formatMessage({
        id: 'templates.credit_card.countries.brazil',
        defaultMessage: 'Brazil',
        description: 'Brazil',
      });
    case 'IO':
      return intl.formatMessage({
        id: 'templates.credit_card.countries.british-indian-ocean-territory',
        defaultMessage: 'British Indian Ocean Territory',
        description: 'British Indian Ocean Territory',
      });
    case 'VG':
      return intl.formatMessage({
        id: 'templates.credit_card.countries.british-virgin-islands',
        defaultMessage: 'British Virgin Islands',
        description: 'British Virgin Islands',
      });
    case 'BN':
      return intl.formatMessage({
        id: 'templates.credit_card.countries.brunei',
        defaultMessage: 'Brunei',
        description: 'Brunei',
      });
    case 'BG':
      return intl.formatMessage({
        id: 'templates.credit_card.countries.bulgaria',
        defaultMessage: 'Bulgaria',
        description: 'Bulgaria',
      });
    case 'BF':
      return intl.formatMessage({
        id: 'templates.credit_card.countries.burkina-faso',
        defaultMessage: 'Burkina Faso',
        description: 'Burkina Faso',
      });
    case 'BI':
      return intl.formatMessage({
        id: 'templates.credit_card.countries.burundi',
        defaultMessage: 'Burundi',
        description: 'Burundi',
      });
    case 'KH':
      return intl.formatMessage({
        id: 'templates.credit_card.countries.cambodia',
        defaultMessage: 'Cambodia',
        description: 'Cambodia',
      });
    case 'CM':
      return intl.formatMessage({
        id: 'templates.credit_card.countries.cameroon',
        defaultMessage: 'Cameroon',
        description: 'Cameroon',
      });
    case 'IC':
      return intl.formatMessage({
        id: 'templates.credit_card.countries.canary-islands',
        defaultMessage: 'Canary Islands',
        description: 'Canary Islands',
      });
    case 'CV':
      return intl.formatMessage({
        id: 'templates.credit_card.countries.cape-verde',
        defaultMessage: 'Cape Verde',
        description: 'Cape Verde',
      });
    case 'KY':
      return intl.formatMessage({
        id: 'templates.credit_card.countries.cayman-islands',
        defaultMessage: 'Cayman Islands',
        description: 'Cayman Islands',
      });
    case 'CF':
      return intl.formatMessage({
        id: 'templates.credit_card.countries.central-african-republic',
        defaultMessage: 'Central African Republic',
        description: 'Central African Republic',
      });
    case 'TD':
      return intl.formatMessage({
        id: 'templates.credit_card.countries.chad',
        defaultMessage: 'Chad',
        description: 'Chad',
      });
    case 'CL':
      return intl.formatMessage({
        id: 'templates.credit_card.countries.chile',
        defaultMessage: 'Chile',
        description: 'Chile',
      });
    case 'CN':
      return intl.formatMessage({
        id: 'templates.credit_card.countries.china',
        defaultMessage: 'China',
        description: 'China',
      });
    case 'CX':
      return intl.formatMessage({
        id: 'templates.credit_card.countries.christmas-island',
        defaultMessage: 'Christmas Island',
        description: 'Christmas Island',
      });
    case 'CC':
      return intl.formatMessage({
        id: 'templates.credit_card.countries.cocos-islands',
        defaultMessage: 'Cocos (Keeling) Islands',
        description: 'Cocos (Keeling) Islands',
      });
    case 'CO':
      return intl.formatMessage({
        id: 'templates.credit_card.countries.colombia',
        defaultMessage: 'Colombia',
        description: 'Colombia',
      });
    // Sanctioned
    case 'BY':
      return intl.formatMessage({
        id: 'templates.credit_card.countries.belarus',
        defaultMessage: 'Belarus',
        description: 'Belarus',
      });
    case 'RU':
      return intl.formatMessage({
        id: 'templates.credit_card.countries.russia',
        defaultMessage: 'Russia',
        description: 'Russia',
      });
    case 'KM':
      return intl.formatMessage({
        id: 'templates.credit_card.countries.comoros',
        defaultMessage: 'Comoros',
        description: 'Comoros',
      });
    case 'CG':
      return intl.formatMessage({
        id: 'templates.credit_card.countries.congo',
        defaultMessage: 'Congo',
        description: 'Congo',
      });
    case 'CK':
      return intl.formatMessage({
        id: 'templates.credit_card.countries.cook-islands',
        defaultMessage: 'Cook Islands',
        description: 'Cook Islands',
      });
    case 'CR':
      return intl.formatMessage({
        id: 'templates.credit_card.countries.costa-rica',
        defaultMessage: 'Costa Rica',
        description: 'Costa Rica',
      });
    case 'CI':
      return intl.formatMessage({
        id: 'templates.credit_card.countries.cote-d-ivoire',
        defaultMessage: 'Cote D’Ivoire',
        description: "Cote D'Ivoire",
      });
    case 'HR':
      return intl.formatMessage({
        id: 'templates.credit_card.countries.croatia',
        defaultMessage: 'Croatia',
        description: 'Croatia',
      });
    case 'CW':
      return intl.formatMessage({
        id: 'templates.credit_card.countries.curacao',
        defaultMessage: 'Curaçao',
        description: 'Curaçao',
      });
    case 'CY':
      return intl.formatMessage({
        id: 'templates.credit_card.countries.cyprus',
        defaultMessage: 'Cyprus',
        description: 'Cyprus',
      });
    case 'CZ':
      return intl.formatMessage({
        id: 'templates.credit_card.countries.czech-republic',
        defaultMessage: 'Czech Republic',
        description: 'Czech Republic',
      });
    case 'DK':
      return intl.formatMessage({
        id: 'templates.credit_card.countries.denmark',
        defaultMessage: 'Denmark',
        description: 'Denmark',
      });
    case 'DJ':
      return intl.formatMessage({
        id: 'templates.credit_card.countries.djibouti',
        defaultMessage: 'Djibouti',
        description: 'Djibouti',
      });
    case 'DM':
      return intl.formatMessage({
        id: 'templates.credit_card.countries.dominica',
        defaultMessage: 'Dominica',
        description: 'Dominica',
      });
    case 'DO':
      return intl.formatMessage({
        id: 'templates.credit_card.countries.dominican-republic',
        defaultMessage: 'Dominican Republic',
        description: 'Dominican Republic',
      });
    case 'EG':
      return intl.formatMessage({
        id: 'templates.credit_card.countries.egypt',
        defaultMessage: 'Egypt',
        description: 'Egypt',
      });
    case 'SV':
      return intl.formatMessage({
        id: 'templates.credit_card.countries.el-salvador',
        defaultMessage: 'El Salvador',
        description: 'El Salvador',
      });
    case 'EC':
      return intl.formatMessage({
        id: 'templates.credit_card.countries.equador',
        defaultMessage: 'Equador',
        description: 'Ecuador',
      });
    case 'GQ':
      return intl.formatMessage({
        id: 'templates.credit_card.countries.equatorial-guinea',
        defaultMessage: 'Equatorial Guinea',
        description: 'Equatorial Guinea',
      });
    case 'ER':
      return intl.formatMessage({
        id: 'templates.credit_card.countries.eritrea',
        defaultMessage: 'Eritrea',
        description: 'Eritrea',
      });
    case 'EE':
      return intl.formatMessage({
        id: 'templates.credit_card.countries.estonia',
        defaultMessage: 'Estonia',
        description: 'Estonia',
      });
    case 'ET':
      return intl.formatMessage({
        id: 'templates.credit_card.countries.ethiopia',
        defaultMessage: 'Ethiopia',
        description: 'Ethiopia',
      });
    case 'FK':
      return intl.formatMessage({
        id: 'templates.credit_card.countries.falkland-islands',
        defaultMessage: 'Falkland Islands',
        description: 'Falkland Islands',
      });
    case 'FO':
      return intl.formatMessage({
        id: 'templates.credit_card.countries.faroe-islands',
        defaultMessage: 'Faroe Islands',
        description: 'Faroe Islands',
      });
    case 'FM':
      return intl.formatMessage({
        id: 'templates.credit_card.countries.federated-states-of-micronesia',
        defaultMessage: 'Federated States of Micronesia',
        description: 'Federated States of Micronesia',
      });
    case 'FJ':
      return intl.formatMessage({
        id: 'templates.credit_card.countries.fiji',
        defaultMessage: 'Fiji',
        description: 'Fiji',
      });
    case 'FI':
      return intl.formatMessage({
        id: 'templates.credit_card.countries.finland',
        defaultMessage: 'Finland',
        description: 'Finland',
      });
    case 'FR':
      return intl.formatMessage({
        id: 'templates.credit_card.countries.france',
        defaultMessage: 'France',
        description: 'France',
      });
    case 'GF':
      return intl.formatMessage({
        id: 'templates.credit_card.countries.french-guiana',
        defaultMessage: 'French Guiana',
        description: 'French Guiana',
      });
    case 'PF':
      return intl.formatMessage({
        id: 'templates.credit_card.countries.french-polynesia',
        defaultMessage: 'French Polynesia',
        description: 'French Polynesia',
      });
    case 'TF':
      return intl.formatMessage({
        id: 'templates.credit_card.countries.french-southern-lands',
        defaultMessage: 'French Southern Lands',
        description: 'French Southern Lands',
      });
    case 'GA':
      return intl.formatMessage({
        id: 'templates.credit_card.countries.gabon',
        defaultMessage: 'Gabon',
        description: 'Gabon',
      });
    case 'GM':
      return intl.formatMessage({
        id: 'templates.credit_card.countries.gambia',
        defaultMessage: 'Gambia',
        description: 'Gambia',
      });
    case 'GE':
      return intl.formatMessage({
        id: 'templates.credit_card.countries.georgia',
        defaultMessage: 'Georgia',
        description: 'Georgia',
      });
    case 'GH':
      return intl.formatMessage({
        id: 'templates.credit_card.countries.ghana',
        defaultMessage: 'Ghana',
        description: 'Ghana',
      });
    case 'GI':
      return intl.formatMessage({
        id: 'templates.credit_card.countries.gibraltar',
        defaultMessage: 'Gibraltar',
        description: 'Gibraltar',
      });
    case 'GR':
      return intl.formatMessage({
        id: 'templates.credit_card.countries.greece',
        defaultMessage: 'Greece',
        description: 'Greece',
      });
    case 'GL':
      return intl.formatMessage({
        id: 'templates.credit_card.countries.greenland',
        defaultMessage: 'Greenland',
        description: 'Greenland',
      });
    case 'GD':
      return intl.formatMessage({
        id: 'templates.credit_card.countries.grenada',
        defaultMessage: 'Grenada',
        description: 'Grenada',
      });
    case 'GP':
      return intl.formatMessage({
        id: 'templates.credit_card.countries.guadeloupe',
        defaultMessage: 'Guadeloupe',
        description: 'Guadeloupe',
      });
    case 'GU':
      return intl.formatMessage({
        id: 'templates.credit_card.countries.guam',
        defaultMessage: 'Guam',
        description: 'Guam',
      });
    case 'GT':
      return intl.formatMessage({
        id: 'templates.credit_card.countries.guatemala',
        defaultMessage: 'Guatemala',
        description: 'Guatemala',
      });
    case 'GG':
      return intl.formatMessage({
        id: 'templates.credit_card.countries.guernsey',
        defaultMessage: 'Guernsey',
        description: 'Guernsey',
      });
    case 'GW':
      return intl.formatMessage({
        id: 'templates.credit_card.countries.guinea-bissau',
        defaultMessage: 'Guinea-Bissau',
        description: 'Guinea-Bissau',
      });
    case 'GN':
      return intl.formatMessage({
        id: 'templates.credit_card.countries.guinea',
        defaultMessage: 'Guinea',
        description: 'Guinea',
      });
    case 'GY':
      return intl.formatMessage({
        id: 'templates.credit_card.countries.guyana',
        defaultMessage: 'Guyana',
        description: 'Guyana',
      });
    case 'HT':
      return intl.formatMessage({
        id: 'templates.credit_card.countries.haiti',
        defaultMessage: 'Haiti',
        description: 'Haiti',
      });
    case 'HM':
      return intl.formatMessage({
        id: 'templates.credit_card.countries.heard-and-mcdonald-islands',
        defaultMessage: 'Heard and McDonald Islands',
        description: 'Heard and McDonald Islands',
      });
    case 'HN':
      return intl.formatMessage({
        id: 'templates.credit_card.countries.honduras',
        defaultMessage: 'Honduras',
        description: 'Honduras',
      });
    case 'HK':
      return intl.formatMessage({
        id: 'templates.credit_card.countries.hong-kong',
        defaultMessage: 'Hong Kong',
        description: 'Hong Kong',
      });
    case 'HU':
      return intl.formatMessage({
        id: 'templates.credit_card.countries.hungary',
        defaultMessage: 'Hungary',
        description: 'Hungary',
      });
    case 'IS':
      return intl.formatMessage({
        id: 'templates.credit_card.countries.iceland',
        defaultMessage: 'Iceland',
        description: 'Iceland',
      });
    case 'IN':
      return intl.formatMessage({
        id: 'templates.credit_card.countries.india',
        defaultMessage: 'India',
        description: 'India',
      });
    case 'ID':
      return intl.formatMessage({
        id: 'templates.credit_card.countries.indonesia',
        defaultMessage: 'Indonesia',
        description: 'Indonesia',
      });
    case 'IQ':
      return intl.formatMessage({
        id: 'templates.credit_card.countries.iraq',
        defaultMessage: 'Iraq',
        description: 'Iraq',
      });
    case 'IE':
      return intl.formatMessage({
        id: 'templates.credit_card.countries.ireland',
        defaultMessage: 'Ireland',
        description: 'Ireland',
      });
    case 'IM':
      return intl.formatMessage({
        id: 'templates.credit_card.countries.isle-of-man',
        defaultMessage: 'Isle of Man',
        description: 'Isle of Man',
      });
    case 'IL':
      return intl.formatMessage({
        id: 'templates.credit_card.countries.israel',
        defaultMessage: 'Israel',
        description: 'Israel',
      });
    case 'IT':
      return intl.formatMessage({
        id: 'templates.credit_card.countries.italy',
        defaultMessage: 'Italy',
        description: 'Italy',
      });
    case 'JM':
      return intl.formatMessage({
        id: 'templates.credit_card.countries.jamaica',
        defaultMessage: 'Jamaica',
        description: 'Jamaica',
      });
    case 'JP':
      return intl.formatMessage({
        id: 'templates.credit_card.countries.japan',
        defaultMessage: 'Japan',
        description: 'Japan',
      });
    case 'JE':
      return intl.formatMessage({
        id: 'templates.credit_card.countries.jersey',
        defaultMessage: 'Jersey',
        description: 'Jersey',
      });
    case 'JO':
      return intl.formatMessage({
        id: 'templates.credit_card.countries.jordan',
        defaultMessage: 'Jordan',
        description: 'Jordan',
      });
    case 'KZ':
      return intl.formatMessage({
        id: 'templates.credit_card.countries.kazakhstan',
        defaultMessage: 'Kazakhstan',
        description: 'Kazakhstan',
      });
    case 'KE':
      return intl.formatMessage({
        id: 'templates.credit_card.countries.kenya',
        defaultMessage: 'Kenya',
        description: 'Kenya',
      });
    case 'KI':
      return intl.formatMessage({
        id: 'templates.credit_card.countries.kiribati',
        defaultMessage: 'Kiribati',
        description: 'Kiribati',
      });
    case 'KW':
      return intl.formatMessage({
        id: 'templates.credit_card.countries.kuwait',
        defaultMessage: 'Kuwait',
        description: 'Kuwait',
      });
    case 'KG':
      return intl.formatMessage({
        id: 'templates.credit_card.countries.kyrgyzstan',
        defaultMessage: 'Kyrgyzstan',
        description: 'Kyrgyzstan',
      });
    case 'LA':
      return intl.formatMessage({
        id: 'templates.credit_card.countries.laos',
        defaultMessage: 'Laos',
        description: 'Laos',
      });
    case 'LV':
      return intl.formatMessage({
        id: 'templates.credit_card.countries.latvia',
        defaultMessage: 'Latvia',
        description: 'Latvia',
      });
    case 'LB':
      return intl.formatMessage({
        id: 'templates.credit_card.countries.lebanon',
        defaultMessage: 'Lebanon',
        description: 'Lebanon',
      });
    case 'LS':
      return intl.formatMessage({
        id: 'templates.credit_card.countries.lesotho',
        defaultMessage: 'Lesotho',
        description: 'Lesotho',
      });
    case 'LR':
      return intl.formatMessage({
        id: 'templates.credit_card.countries.liberia',
        defaultMessage: 'Liberia',
        description: 'Liberia',
      });
    case 'LY':
      return intl.formatMessage({
        id: 'templates.credit_card.countries.libya',
        defaultMessage: 'Libya',
        description: 'Libya',
      });
    case 'LI':
      return intl.formatMessage({
        id: 'templates.credit_card.countries.liechtenstein',
        defaultMessage: 'Liechtenstein',
        description: 'Liechtenstein',
      });
    case 'LT':
      return intl.formatMessage({
        id: 'templates.credit_card.countries.lithuania',
        defaultMessage: 'Lithuania',
        description: 'Lithuania',
      });
    case 'LU':
      return intl.formatMessage({
        id: 'templates.credit_card.countries.luxembourg',
        defaultMessage: 'Luxembourg',
        description: 'Luxembourg',
      });
    case 'MO':
      return intl.formatMessage({
        id: 'templates.credit_card.countries.macau',
        defaultMessage: 'Macau',
        description: 'Macau',
      });
    case 'MG':
      return intl.formatMessage({
        id: 'templates.credit_card.countries.madagascar',
        defaultMessage: 'Madagascar',
        description: 'Madagascar',
      });
    case 'MW':
      return intl.formatMessage({
        id: 'templates.credit_card.countries.malawi',
        defaultMessage: 'Malawi',
        description: 'Malawi',
      });
    case 'MY':
      return intl.formatMessage({
        id: 'templates.credit_card.countries.malaysia',
        defaultMessage: 'Malaysia',
        description: 'Malaysia',
      });
    case 'MV':
      return intl.formatMessage({
        id: 'templates.credit_card.countries.maldives',
        defaultMessage: 'Maldives',
        description: 'Maldives',
      });
    case 'ML':
      return intl.formatMessage({
        id: 'templates.credit_card.countries.mali',
        defaultMessage: 'Mali',
        description: 'Mali',
      });
    case 'MT':
      return intl.formatMessage({
        id: 'templates.credit_card.countries.malta',
        defaultMessage: 'Malta',
        description: 'Malta',
      });
    case 'MH':
      return intl.formatMessage({
        id: 'templates.credit_card.countries.marshall-islands',
        defaultMessage: 'Marshall Islands',
        description: 'Marshall Islands',
      });
    case 'MQ':
      return intl.formatMessage({
        id: 'templates.credit_card.countries.martinique',
        defaultMessage: 'Martinique',
        description: 'Martinique',
      });
    case 'MR':
      return intl.formatMessage({
        id: 'templates.credit_card.countries.mauritania',
        defaultMessage: 'Mauritania',
        description: 'Mauritania',
      });
    case 'MU':
      return intl.formatMessage({
        id: 'templates.credit_card.countries.mauritius',
        defaultMessage: 'Mauritius',
        description: 'Mauritius',
      });
    case 'YT':
      return intl.formatMessage({
        id: 'templates.credit_card.countries.mayotte',
        defaultMessage: 'Mayotte',
        description: 'Mayotte',
      });
    case 'MX':
      return intl.formatMessage({
        id: 'templates.credit_card.countries.mexico',
        defaultMessage: 'Mexico',
        description: 'Mexico',
      });
    case 'MD':
      return intl.formatMessage({
        id: 'templates.credit_card.countries.moldova',
        defaultMessage: 'Moldova',
        description: 'Moldova',
      });
    case 'MC':
      return intl.formatMessage({
        id: 'templates.credit_card.countries.monaco',
        defaultMessage: 'Monaco',
        description: 'Monaco',
      });
    case 'MN':
      return intl.formatMessage({
        id: 'templates.credit_card.countries.mongolia',
        defaultMessage: 'Mongolia',
        description: 'Mongolia',
      });
    case 'ME':
      return intl.formatMessage({
        id: 'templates.credit_card.countries.montenegro',
        defaultMessage: 'Montenegro',
        description: 'Montenegro',
      });
    case 'MS':
      return intl.formatMessage({
        id: 'templates.credit_card.countries.montserrat',
        defaultMessage: 'Montserrat',
        description: 'Montserrat',
      });
    case 'MA':
      return intl.formatMessage({
        id: 'templates.credit_card.countries.morocco',
        defaultMessage: 'Morocco',
        description: 'Morocco',
      });
    case 'MZ':
      return intl.formatMessage({
        id: 'templates.credit_card.countries.mozambique',
        defaultMessage: 'Mozambique',
        description: 'Mozambique',
      });
    case 'MM':
      return intl.formatMessage({
        id: 'templates.credit_card.countries.myanmar',
        defaultMessage: 'Myanmar',
        description: 'Myanmar',
      });
    case 'NA':
      return intl.formatMessage({
        id: 'templates.credit_card.countries.namibia',
        defaultMessage: 'Namibia',
        description: 'Namibia',
      });
    case 'NR':
      return intl.formatMessage({
        id: 'templates.credit_card.countries.nauru',
        defaultMessage: 'Nauru',
        description: 'Nauru',
      });
    case 'NP':
      return intl.formatMessage({
        id: 'templates.credit_card.countries.nepal',
        defaultMessage: 'Nepal',
        description: 'Nepal',
      });
    case 'NC':
      return intl.formatMessage({
        id: 'templates.credit_card.countries.new-caledonia',
        defaultMessage: 'New Caledonia',
        description: 'New Caledonia',
      });
    case 'NZ':
      return intl.formatMessage({
        id: 'templates.credit_card.countries.new-zealand',
        defaultMessage: 'New Zealand',
        description: 'New Zealand',
      });
    case 'NI':
      return intl.formatMessage({
        id: 'templates.credit_card.countries.nicaragua',
        defaultMessage: 'Nicaragua',
        description: 'Nicaragua',
      });
    case 'NE':
      return intl.formatMessage({
        id: 'templates.credit_card.countries.niger',
        defaultMessage: 'Niger',
        description: 'Niger',
      });
    case 'NG':
      return intl.formatMessage({
        id: 'templates.credit_card.countries.nigeria',
        defaultMessage: 'Nigeria',
        description: 'Nigeria',
      });
    case 'NU':
      return intl.formatMessage({
        id: 'templates.credit_card.countries.niue',
        defaultMessage: 'Niue',
        description: 'Niue',
      });
    case 'NF':
      return intl.formatMessage({
        id: 'templates.credit_card.countries.norfolk-island',
        defaultMessage: 'Norfolk Island',
        description: 'Norfolk Island',
      });
    case 'MP':
      return intl.formatMessage({
        id: 'templates.credit_card.countries.northern-mariana-islands',
        defaultMessage: 'Northern Mariana Islands',
        description: 'Northern Mariana Islands',
      });
    case 'NO':
      return intl.formatMessage({
        id: 'templates.credit_card.countries.norway',
        defaultMessage: 'Norway',
        description: 'Norway',
      });
    case 'OM':
      return intl.formatMessage({
        id: 'templates.credit_card.countries.oman',
        defaultMessage: 'Oman',
        description: 'Oman',
      });
    case 'PK':
      return intl.formatMessage({
        id: 'templates.credit_card.countries.pakistan',
        defaultMessage: 'Pakistan',
        description: 'Pakistan',
      });
    case 'PW':
      return intl.formatMessage({
        id: 'templates.credit_card.countries.palau',
        defaultMessage: 'Palau',
        description: 'Palau',
      });
    case 'PS':
      return intl.formatMessage({
        id: 'templates.credit_card.countries.palestine',
        defaultMessage: 'Palestine',
        description: 'Palestine',
      });
    case 'PA':
      return intl.formatMessage({
        id: 'templates.credit_card.countries.panama',
        defaultMessage: 'Panama',
        description: 'Panama',
      });
    case 'PG':
      return intl.formatMessage({
        id: 'templates.credit_card.countries.papua-new-guinea',
        defaultMessage: 'Papua New Guinea',
        description: 'Papua New Guinea',
      });
    case 'PY':
      return intl.formatMessage({
        id: 'templates.credit_card.countries.paraguay',
        defaultMessage: 'Paraguay',
        description: 'Paraguay',
      });
    case 'PE':
      return intl.formatMessage({
        id: 'templates.credit_card.countries.peru',
        defaultMessage: 'Peru',
        description: 'Peru',
      });
    case 'PH':
      return intl.formatMessage({
        id: 'templates.credit_card.countries.philippines',
        defaultMessage: 'Philippines',
        description: 'Philippines',
      });
    case 'PN':
      return intl.formatMessage({
        id: 'templates.credit_card.countries.pitcairn',
        defaultMessage: 'Pitcairn',
        description: 'Pitcairn',
      });
    case 'PL':
      return intl.formatMessage({
        id: 'templates.credit_card.countries.poland',
        defaultMessage: 'Poland',
        description: 'Poland',
      });
    case 'PT':
      return intl.formatMessage({
        id: 'templates.credit_card.countries.portugal',
        defaultMessage: 'Portugal',
        description: 'Portugal',
      });
    case 'PR':
      return intl.formatMessage({
        id: 'templates.credit_card.countries.puerto-rico',
        defaultMessage: 'Puerto Rico',
        description: 'Puerto Rico',
      });
    case 'QA':
      return intl.formatMessage({
        id: 'templates.credit_card.countries.qatar',
        defaultMessage: 'Qatar',
        description: 'Qatar',
      });
    case 'KR':
      return intl.formatMessage({
        id: 'templates.credit_card.countries.republic-of-korea',
        defaultMessage: 'Republic of Korea',
        description: 'Republic of Korea',
      });
    case 'RE':
      return intl.formatMessage({
        id: 'templates.credit_card.countries.reunion',
        defaultMessage: 'Reunion',
        description: 'Réunion',
      });
    case 'RO':
      return intl.formatMessage({
        id: 'templates.credit_card.countries.romania',
        defaultMessage: 'Romania',
        description: 'Romania',
      });
    case 'RW':
      return intl.formatMessage({
        id: 'templates.credit_card.countries.rwanda',
        defaultMessage: 'Rwanda',
        description: 'Rwanda',
      });
    case 'BL':
      return intl.formatMessage({
        id: 'templates.credit_card.countries.saint-barthelemy',
        defaultMessage: 'Saint Barthélemy',
        description: 'Saint Barthélemy',
      });
    case 'MF':
      return intl.formatMessage({
        id: 'templates.credit_card.countries.saint-martin',
        defaultMessage: 'Saint Martin',
        description: 'Saint Martin',
      });
    case 'PM':
      return intl.formatMessage({
        id: 'templates.credit_card.countries.saint-pierre-and-miquelon',
        defaultMessage: 'Saint Pierre and Miquelon',
        description: 'Saint Pierre and Miquelon',
      });
    case 'WS':
      return intl.formatMessage({
        id: 'templates.credit_card.countries.samoa',
        defaultMessage: 'Samoa',
        description: 'Samoa',
      });
    case 'SM':
      return intl.formatMessage({
        id: 'templates.credit_card.countries.san-marino',
        defaultMessage: 'San Marino',
        description: 'San Marino',
      });
    case 'ST':
      return intl.formatMessage({
        id: 'templates.credit_card.countries.sao-tome-and-principe',
        defaultMessage: 'Sao Tome and Principe',
        description: 'São Tomé and Príncipe',
      });
    case 'SA':
      return intl.formatMessage({
        id: 'templates.credit_card.countries.saudi-arabia',
        defaultMessage: 'Saudi Arabia',
        description: 'Saudi Arabia',
      });
    case 'SN':
      return intl.formatMessage({
        id: 'templates.credit_card.countries.senegal',
        defaultMessage: 'Senegal',
        description: 'Senegal',
      });
    case 'RS':
      return intl.formatMessage({
        id: 'templates.credit_card.countries.serbia',
        defaultMessage: 'Serbia',
        description: 'Serbia',
      });
    case 'SC':
      return intl.formatMessage({
        id: 'templates.credit_card.countries.seychelles',
        defaultMessage: 'Seychelles',
        description: 'Seychelles',
      });
    case 'SL':
      return intl.formatMessage({
        id: 'templates.credit_card.countries.sierra-leone',
        defaultMessage: 'Sierra Leone',
        description: 'Sierra Leone',
      });
    case 'SG':
      return intl.formatMessage({
        id: 'templates.credit_card.countries.singapore',
        defaultMessage: 'Singapore',
        description: 'Singapore',
      });
    case 'SX':
      return intl.formatMessage({
        id: 'templates.credit_card.countries.sint-maarten',
        defaultMessage: 'Sint Maarten',
        description: 'Sint Maarten',
      });
    case 'SK':
      return intl.formatMessage({
        id: 'templates.credit_card.countries.slovakia',
        defaultMessage: 'Slovakia',
        description: 'Slovakia',
      });
    case 'SI':
      return intl.formatMessage({
        id: 'templates.credit_card.countries.slovenia',
        defaultMessage: 'Slovenia',
        description: 'Slovenia',
      });
    case 'SB':
      return intl.formatMessage({
        id: 'templates.credit_card.countries.solomon-islands',
        defaultMessage: 'Solomon Islands',
        description: 'Solomon Islands',
      });
    case 'SO':
      return intl.formatMessage({
        id: 'templates.credit_card.countries.somalia',
        defaultMessage: 'Somalia',
        description: 'Somalia',
      });
    case 'ZA':
      return intl.formatMessage({
        id: 'templates.credit_card.countries.south-africa',
        defaultMessage: 'South Africa',
        description: 'South Africa',
      });
    case 'GS':
      return intl.formatMessage({
        id: 'templates.credit_card.countries.south-georgia-and-south-sandwich-islands',
        defaultMessage: 'South Georgia and South Sandwich Islands',
        description: 'South Georgia and South Sandwich Islands',
      });
    case 'SS':
      return intl.formatMessage({
        id: 'templates.credit_card.countries.south-sudan',
        defaultMessage: 'South Sudan',
        description: 'South Sudan',
      });
    case 'ES':
      return intl.formatMessage({
        id: 'templates.credit_card.countries.spain',
        defaultMessage: 'Spain',
        description: 'Spain',
      });
    case 'LK':
      return intl.formatMessage({
        id: 'templates.credit_card.countries.sri-lanka',
        defaultMessage: 'Sri Lanka',
        description: 'Sri Lanka',
      });
    case 'SH':
      return intl.formatMessage({
        id: 'templates.credit_card.countries.st-helena',
        defaultMessage: 'St. Helena',
        description: 'St Helena',
      });
    case 'KN':
      return intl.formatMessage({
        id: 'templates.credit_card.countries.st-kitts-and-nevis',
        defaultMessage: 'St. Kitts and Nevis',
        description: 'St Kitts and Nevis',
      });
    case 'LC':
      return intl.formatMessage({
        id: 'templates.credit_card.countries.st-lucia',
        defaultMessage: 'St. Lucia',
        description: 'St Lucia',
      });
    case 'VC':
      return intl.formatMessage({
        id: 'templates.credit_card.countries.st-vincent-and-the-grenadines',
        defaultMessage: 'St. Vincent and the Grenadines',
        description: 'St Vincent and the Grenadines',
      });
    case 'SD':
      return intl.formatMessage({
        id: 'templates.credit_card.countries.sudan',
        defaultMessage: 'Sudan',
        description: 'Sudan',
      });
    case 'SR':
      return intl.formatMessage({
        id: 'templates.credit_card.countries.suriname',
        defaultMessage: 'Suriname',
        description: 'Suriname',
      });
    case 'SJ':
      return intl.formatMessage({
        id: 'templates.credit_card.countries.svalbard-and-jan-mayen-islands',
        defaultMessage: 'Svalbard and Jan Mayen Islands',
        description: 'Svalbard and Jan Mayen Islands',
      });
    case 'SZ':
      return intl.formatMessage({
        id: 'templates.credit_card.countries.swaziland',
        defaultMessage: 'Swaziland',
        description: 'Swaziland',
      });
    case 'SE':
      return intl.formatMessage({
        id: 'templates.credit_card.countries.sweden',
        defaultMessage: 'Sweden',
        description: 'Sweden',
      });
    case 'CH':
      return intl.formatMessage({
        id: 'templates.credit_card.countries.switzerland',
        defaultMessage: 'Switzerland',
        description: 'Switzerland',
      });
    case 'TW':
      return intl.formatMessage({
        id: 'templates.credit_card.countries.taiwan',
        defaultMessage: 'Taiwan',
        description: 'Taiwan',
      });
    case 'TJ':
      return intl.formatMessage({
        id: 'templates.credit_card.countries.tajikistan',
        defaultMessage: 'Tajikistan',
        description: 'Tajikistan',
      });
    case 'TZ':
      return intl.formatMessage({
        id: 'templates.credit_card.countries.tanzania',
        defaultMessage: 'Tanzania',
        description: 'Tanzania',
      });
    case 'TH':
      return intl.formatMessage({
        id: 'templates.credit_card.countries.thailand',
        defaultMessage: 'Thailand',
        description: 'Thailand',
      });
    case 'MK':
      return intl.formatMessage({
        id: 'templates.credit_card.countries.the-former-yugoslav-republic-of-macedonia',
        defaultMessage: 'The former Yugoslav Republic of Macedonia',
        description: 'The Former Yugoslav Republic of Macedonia',
      });
    case 'TL':
      return intl.formatMessage({
        id: 'templates.credit_card.countries.timor-leste',
        defaultMessage: 'Timor-Leste',
        description: 'Timor-Leste',
      });
    case 'TG':
      return intl.formatMessage({
        id: 'templates.credit_card.countries.togo',
        defaultMessage: 'Togo',
        description: 'Togo',
      });
    case 'TK':
      return intl.formatMessage({
        id: 'templates.credit_card.countries.tokelau',
        defaultMessage: 'Tokelau',
        description: 'Tokelau',
      });
    case 'TO':
      return intl.formatMessage({
        id: 'templates.credit_card.countries.tonga',
        defaultMessage: 'Tonga',
        description: 'Tonga',
      });
    case 'TT':
      return intl.formatMessage({
        id: 'templates.credit_card.countries.trinidad-and-tobago',
        defaultMessage: 'Trinidad and Tobago',
        description: 'Trinidad and Tobago',
      });
    case 'TN':
      return intl.formatMessage({
        id: 'templates.credit_card.countries.tunisia',
        defaultMessage: 'Tunisia',
        description: 'Tunisia',
      });
    case 'TR':
      return intl.formatMessage({
        id: 'templates.credit_card.countries.turkey',
        defaultMessage: 'Turkey',
        description: 'Turkey',
      });
    case 'TM':
      return intl.formatMessage({
        id: 'templates.credit_card.countries.turkmenistan',
        defaultMessage: 'Turkmenistan',
        description: 'Turkmenistan',
      });
    case 'TC':
      return intl.formatMessage({
        id: 'templates.credit_card.countries.turks-and-caicos-islands',
        defaultMessage: 'Turks and Caicos Islands',
        description: 'Turks and Caicos Islands',
      });
    case 'TV':
      return intl.formatMessage({
        id: 'templates.credit_card.countries.tuvalu',
        defaultMessage: 'Tuvalu',
        description: 'Tuvalu',
      });
    case 'UG':
      return intl.formatMessage({
        id: 'templates.credit_card.countries.uganda',
        defaultMessage: 'Uganda',
        description: 'Uganda',
      });
    case 'UA':
      return intl.formatMessage({
        id: 'templates.credit_card.countries.ukraine',
        defaultMessage: 'Ukraine',
        description: 'Ukraine',
      });
    case 'AE':
      return intl.formatMessage({
        id: 'templates.credit_card.countries.united-arab-emirates',
        defaultMessage: 'United Arab Emirates',
        description: 'United Arab Emirates',
      });
    case 'UY':
      return intl.formatMessage({
        id: 'templates.credit_card.countries.uruguay',
        defaultMessage: 'Uruguay',
        description: 'Uruguay',
      });
    case 'UZ':
      return intl.formatMessage({
        id: 'templates.credit_card.countries.uzbekistan',
        defaultMessage: 'Uzbekistan',
        description: 'Uzbekistan',
      });
    case 'VU':
      return intl.formatMessage({
        id: 'templates.credit_card.countries.vanuatu',
        defaultMessage: 'Vanuatu',
        description: 'Vanuatu',
      });
    case 'VA':
      return intl.formatMessage({
        id: 'templates.credit_card.countries.vatican-city',
        defaultMessage: 'Vatican City',
        description: 'Vatican City',
      });
    case 'VE':
      return intl.formatMessage({
        id: 'templates.credit_card.countries.venezuela',
        defaultMessage: 'Venezuela',
        description: 'Venezuela',
      });
    case 'VN':
      return intl.formatMessage({
        id: 'templates.credit_card.countries.vietnam',
        defaultMessage: 'Vietnam',
        description: 'Vietnam',
      });
    case 'VI':
      return intl.formatMessage({
        id: 'templates.credit_card.countries.virgin-islands-us',
        defaultMessage: 'Virgin Islands, U.S.',
        description: 'Virgin Islands (US)',
      });
    case 'WF':
      return intl.formatMessage({
        id: 'templates.credit_card.countries.wallis-and-futuna-islands',
        defaultMessage: 'Wallis and Futuna Islands',
        description: 'Wallis and Futuna Islands',
      });
    case 'EH':
      return intl.formatMessage({
        id: 'templates.credit_card.countries.western-sahara',
        defaultMessage: 'Western Sahara',
        description: 'Western Sahara',
      });
    case 'YE':
      return intl.formatMessage({
        id: 'templates.credit_card.countries.yemen',
        defaultMessage: 'Yemen',
        description: 'Yemen',
      });
    case 'CD':
      return intl.formatMessage({
        id: 'templates.credit_card.countries.zaire',
        defaultMessage: 'Zaire',
        description: 'Zaire',
      });
    case 'ZM':
      return intl.formatMessage({
        id: 'templates.credit_card.countries.zambia',
        defaultMessage: 'Zambia',
        description: 'Zambia',
      });
    case 'ZW':
      return intl.formatMessage({
        id: 'templates.credit_card.countries.zimbabwe',
        defaultMessage: 'Zimbabwe',
        description: 'Zimbabwe',
      });
    default:
      return '';
  }
};
