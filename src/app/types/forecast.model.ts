export interface ForecastItem {
    dt_txt: string;
    main: {
      temp: number;
      pressure: number;
    };
    weather: {
      description: string;
      icon: string;
    }[];
    wind: {
      speed: number;
    };
    clouds: {
      all: number;
    };
  }