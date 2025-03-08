import { IOption } from '@lsq/nextgen-preact/dropdown/dropdown.types';

/* eslint-disable @typescript-eslint/naming-convention */
export const TIME_ZONE_OPTIONS = {
  'IST - (GMT+05:30) Chennai, Kolkata, Mumbai, New Delhi': 'India Standard Time$Asia/Kolkata',

  'SMST - (GMT-11:00) Midway Island, Samoa': 'Samoa Standard Time$Pacific/Samoa',

  'HAST - (GMT-10:00) Hawaii': 'Hawaiian Standard Time$US/Hawaii',

  'AK - (GMT-09:00) Alaska': 'Alaskan Standard Time$US/Alaska',

  'PT - (GMT-08:00) Pacific Time (US and Canada), Tijuana': 'Pacific Standard Time$US/Pacific',

  'MST - (GMT-07:00) Arizona': 'US Mountain Standard Time$US/Arizona',

  'MSTM - (GMT-07:00) Chihuahua, La Paz, Mazatlan':
    'Mountain Standard Time (Mexico)$Canada/Mountain',

  'MT - (GMT-07:00) Mountain Time (US and Canada)': 'Mountain Standard Time$US/Mountain',

  'CST - (GMT-06:00) Guadalajara, Mexico City, Monterrey':
    'Central Standard Time (Mexico)$America/Mexico_City',

  'CT - (GMT-06:00) Central Time (US and Canada)': 'Central Standard Time$US/Central',

  'CAST - (GMT-06:00) Central America': 'Central America Standard Time$America/Guatemala',

  'CCST - (GMT-06:00) Saskatchewan': 'Canada Central Standard Time$Canada/Saskatchewan',

  'EST - (GMT-05:00) Indiana (East)': 'US Eastern Standard Time$US/East-Indiana',

  'SAPST - (GMT-05:00) Bogota, Lima, Quito': 'SA Pacific Standard Time$America/Bogota',

  'ET - (GMT-05:00) Eastern Time (US and Canada)': 'Eastern Standard Time$US/Eastern',

  'CBST - (GMT-04:00) Manaus': 'Central Brazilian Standard Time$America/Manaus',

  'SAWST - (GMT-04:00) Caracas, La Paz': 'SA Western Standard Time$America/Caracas',

  'PSAST - (GMT-04:00) Santiago': 'Pacific SA Standard Time$America/Santiago',

  'AST - (GMT-04:00) Atlantic Time (Canada)': 'Atlantic Standard Time$Canada/Atlantic',

  'NST - (GMT-03:30) Newfoundland and Labrador': 'Newfoundland Standard Time$Canada/Newfoundland',

  'SAEST - (GMT-03:00) Buenos Aires, Georgetown':
    'SA Eastern Standard Time$America/Argentina/Buenos_Aires',

  'GNST - (GMT-03:00) Greenland': 'Greenland Standard Time$America/Godthab',

  'ESAST - (GMT-03:00) Brasilia': 'E. South America Standard Time$America/Bahia',

  'UTC02 - (GMT-02:00) Mid-Atlantic': 'Mid-Atlantic Standard Time$Etc/GMT-2',

  'CVT - (GMT-01:00) Cape Verde Islands': 'Cape Verde Standard Time$Atlantic/Cape_Verde',

  'AZOST - (GMT-01:00) Azores': 'Azores Standard Time$Atlantic/Azores',

  'GST - (GMT-00:00) Casablanca, Monrovia': 'Greenwich Standard Time$Africa/Casablanca',

  'GMT - (GMT-00:00) Greenwich Mean Time : Dublin, Edinburgh, Lisbon, London':
    'GMT Standard Time$Europe/London',

  'WET - (GMT+01:00) Amsterdam, Berlin, Bern, Rome, Stockholm, Vienna':
    'W. Europe Standard Time$Europe/Amsterdam',

  'ECT - (GMT+01:00) West Central Africa': 'W. Central Africa Standard Time$Africa/Algiers',

  'RST - (GMT+01:00) Brussels, Copenhagen, Madrid, Paris': 'Romance Standard Time$Europe/Brussels',

  'CEST - (GMT+01:00) Sarajevo, Skopje, Warsaw, Zagreb':
    'Central European Standard Time$Europe/Sarajevo',

  'CET - (GMT+01:00) Belgrade, Bratislava, Budapest, Ljubljana, Prague':
    'Central Europe Standard Time$Europe/Belgrade',

  'NMST - (GMT+02:00) Windhoek': 'Namibia Standard Time$Africa/Windhoek',

  'SAST - (GMT+02:00) Harare, Pretoria': 'South Africa Standard Time$Africa/Harare',

  'ISST - (GMT+02:00) Jerusalem': 'Israel Standard Time$Asia/Jerusalem',

  'GTBST - (GMT+02:00) Athens, Bucharest, Istanbul': 'GTB Standard Time$Europe/Athens',

  'EET - (GMT+02:00) Helsinki, Kiev, Riga, Sofia, Tallinn, Vilnius':
    'FLE Standard Time$Europe/Kiev',

  'EGST - (GMT+02:00) Cairo': 'Egypt Standard Time$Africa/Cairo',

  'EEST - (GMT+02:00) Minsk': 'E. Europe Standard Time$Europe/Minsk',

  'MSK - (GMT+03:00) Moscow, St. Petersburg, Volgograd': 'Russian Standard Time$Europe/Moscow',

  'EAT - (GMT+03:00) Nairobi': 'E. Africa Standard Time$Africa/Nairobi',

  'ARST - (GMT+03:00) Baghdad': 'Arabic Standard Time$Asia/Baghdad',

  'ABST - (GMT+03:00) Kuwait, Riyadh': 'Arab Standard Time$Asia/Kuwait',

  'IRST - (GMT+03:30) Tehran': 'Iran Standard Time$Asia/Tehran',

  'GET - (GMT+04:00) Tblisi': 'Georgian Standard Time$Asia/Tbilisi',

  'AZT - (GMT+04:00) Baku': 'Azerbaijan Standard Time$Asia/Baku',

  'AMT - (GMT+04:00) Yerevan': 'Caucasus Standard Time$Asia/Yerevan',

  'ARBST - (GMT+04:00) Abu Dhabi, Muscat': 'Arabian Standard Time$Asia/Muscat',

  'AFT - (GMT+04:30) Kabul': 'Afghanistan Standard Time$Asia/Kabul',

  'WAST - (GMT+05:00) Islamabad, Karachi, Tashkent': 'West Asia Standard Time$Asia/Karachi',

  'YEKT - (GMT+05:00) Ekaterinburg': 'Ekaterinburg Standard Time$Asia/Yekaterinburg',

  'NPT - (GMT+05:45) Kathmandu': 'Nepal Standard Time$Asia/Katmandu',

  'SLT - (GMT+06:00) Sri Jayawardenepura': 'Sri Lanka Standard Time$Asia/Colombo',

  'NCAST - (GMT+06:00) Almaty, Novosibirsk': 'N. Central Asia Standard Time$Asia/Almaty',

  'BTT - (GMT+06:00) Astana, Dhaka': 'Central Asia Standard Time$Asia/Dhaka',

  'MYST - (GMT+06:30) Yangon (Rangoon)': 'Myanmar Standard Time$Asia/Rangoon',

  'THA - (GMT+07:00) Bangkok, Hanoi, Jakarta': 'SE Asia Standard Time$Asia/Bangkok',

  'KRAT - (GMT+07:00) Krasnoyarsk': 'North Asia Standard Time$Asia/Krasnoyarsk',

  'AWST - (GMT+08:00) Perth': 'W. Australia Standard Time$Australia/Perth',

  'TIST - (GMT+08:00) Taipei': 'Taipei Standard Time$Asia/Taipei',

  'SNST - (GMT+08:00) Kuala Lumpur, Singapore': 'Singapore Standard Time$Asia/Singapore',

  'IRKT - (GMT+08:00) Irkutsk, Ulaanbaatar': 'North Asia East Standard Time$Asia/Irkutsk',

  'CST - (GMT+08:00) Beijing, Chongqing, Hong Kong SAR, Urumqi':
    'China Standard Time$Asia/Chongqing',

  'YAKT - (GMT+09:00) Yakutsk': 'Yakutsk Standard Time$Asia/Yakutsk',

  'TST - (GMT+09:00) Osaka, Sapporo, Tokyo': 'Tokyo Standard Time$Asia/Tokyo',

  'KST - (GMT+09:00) Seoul': 'Korea Standard Time$Asia/Seoul',

  'CAUST - (GMT+09:30) Adelaide': 'Cen. Australia Standard Time$Australia/Adelaide',

  'ACST - (GMT+09:30) Darwin': 'AUS Central Standard Time$Australia/Darwin',

  'WPST - (GMT+10:00) Guam, Port Moresby': 'West Pacific Standard Time$Pacific/Guam',

  'VLAT - (GMT+10:00) Vladivostok': 'Vladivostok Standard Time$Asia/Vladivostok',

  'TAST - (GMT+10:00) Hobart': 'Tasmania Standard Time$Australia/Hobart',

  'EAST - (GMT+10:00) Brisbane': 'E. Australia Standard Time$Australia/Brisbane',

  'AEST - (GMT+10:00) Canberra, Melbourne, Sydney': 'AUS Eastern Standard Time$Australia/Canberra',

  'SBT - (GMT+11:00) Magadan, Solomon Islands, New Caledonia':
    'Central Pacific Standard Time$Asia/Magadan',

  'NZST - (GMT+12:00) Auckland, Wellington': 'New Zealand Standard Time$Pacific/Auckland',

  'FJT - (GMT+12:00) Fiji Islands, Kamchatka, Marshall Islands': 'Fiji Standard Time$Pacific/Fiji',

  "PHOT - (GMT+13:00) Nuku'alofa": 'Tonga Standard Time$Pacific/Tongatapu',
  'IDLT - (GMT-12:00) International Date Line West': '$-12:00'
};

export const getTimezoneOptions = (search?: string): IOption[] => {
  return Object.keys(TIME_ZONE_OPTIONS).reduce((acc: IOption[], key) => {
    if (key.includes(search || '')) {
      acc.push({ label: key, value: (TIME_ZONE_OPTIONS[key] as string).split('$')?.[1] });
    }
    return acc;
  }, []);
};

export const getTimezoneFullName = (key: string): string => {
  const keyValueMap: Record<string, string> = {};
  Object.keys(TIME_ZONE_OPTIONS)?.forEach((optionKey) => {
    keyValueMap[TIME_ZONE_OPTIONS[optionKey]?.split('$')?.[1]] = optionKey?.split(' - ')?.[1];
  });
  return keyValueMap?.[key] || '';
};
