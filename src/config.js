export default {
  properties: {
    title: 'Main Settings',
    options: [
      {
        id: 'run_time',
        min: 1,
        max: 5760,
        default: 2880,
        label: 'Simulation world time',
        help: 'Simulated world time in minutes',
        units: 'minutes',
        module: 'simulation',
        experimental: false,
      },
      {
        id: 'runs_per_config',
        min: 1,
        max: 20,
        default: 1,
        label: 'Number of simulations to run',
        units: 'per configuration',
        module: 'simulation',
        experimental: false,
      },
      {
        id: 'init_infection_num',
        min: 0,
        max: 10000,
        step: 1,
        default: 1920,
        label: 'Initial count of A. fumigatus conidia',
        units: 'cells',
        module: 'afumigatus',
        experimental: true,
      },
      {
        id: 'validate',
        type: 'checkbox',
        default: true,
        label: 'Perform validation per time step',
        help: 'Flags out-of-bounds data fields, reduces speed',
        module: 'simulation',
        experimental: false,
      },
    ],
    subsections: {},
  },
  macrophage: {
    title: 'Macrophage',
    options: [
      {
        id: 'init_num_macrophages',
        min: 0,
        max: 209,
        step: 1,
        default: 15,
        label: 'Initial number of macrophages',
        units: 'cells',
        module: 'macrophage',
        experimental: true,
      },
    ],
    subsections: {
      rates: [
        {
          id: 'recruitment_rate',
          min: 1,
          max: 300,
          step: 1,
          default: 200,
          label: 'Recruitment rate',
          units: '',
          module: 'macrophage',
          experimental: true,
        },
        {
          id: 'ma_move_rate_rest',
          min: 0.01,
          max: 10,
          step: 0.01,
          default: 1.44,
          label: 'Movement rate (resting)',
          units: 'µm/min',
          module: 'macrophage',
          experimental: true,
        },
        {
          id: 'ma_move_rate_act',
          min: 0.01,
          max: 10,
          step: 0.01,
          default: 1.44,
          label: 'Movement rate (active)',
          units: 'µm/min',
          module: 'macrophage',
          experimental: true,
        },
      ],
      bounds: [
        {
          id: 'max_ma',
          min: 0,
          max: 500,
          step: 1,
          default: 209,
          label: 'Maximum number of macrophages',
          units: 'cells',
          module: 'macrophage',
          experimental: true,
        },
        {
          id: 'min_ma',
          min: 0,
          max: 50,
          step: 1,
          default: 15,
          label: 'Minimum number of macrophages',
          units: 'cells',
          module: 'macrophage',
          experimental: true,
        },
        {
          id: 'ma_half_life',
          min: 0,
          max: 50,
          step: 1,
          default: 24,
          label: 'Macrophage half-life',
          units: 'hours',
          module: 'macrophage',
          experimental: true,
        },
      ],
    },
  },
  neutrophil: {
    title: 'Neutrophil',
    options: [
      {
        id: 'init_num_neutrophils',
        min: 0,
        max: 600,
        step: 1,
        default: 0,
        label: 'Initial number of neutrophils',
        units: 'cells',
        module: 'neutrophil',
        experimental: true,
      },
    ],
    subsections: {
      rates: [
        {
          id: 'recruitment_rate',
          min: 0,
          max: 500,
          step: 1.0,
          default: 200.0,
          label: 'Recruitment rate',
          units: '',
          module: 'neutrophil',
          experimental: true,
        },
        {
          id: 'n_move_rate_rest',
          min: 0,
          max: 1.5,
          step: 0.001,
          default: 0.036,
          label: 'Movement rate (resting)',
          units: 'µm/min',
          module: 'neutrophil',
          experimental: true,
        },
        {
          id: 'n_move_rate_act',
          min: 0,
          max: 1.5,
          step: 0.001,
          default: 0.036,
          label: 'Movement rate (active)',
          units: 'µm/min',
          module: 'neutrophil',
          experimental: true,
        },
      ],
    },
  },
  erythrocyte: {
    title: 'Erythrocyte',
    options: [
      {
        id: 'init_erythrocyte_level',
        min: 0,
        max: 1000,
        step: 1,
        default: 180,
        label: 'Initial number of erythrocytes',
        units: 'count/voxel',
        help: 'count per blood voxel',
        module: 'erythrocyte',
        experimental: true,
      },
    ],
    subsections: {},
  },
  molecules: {
    title: 'Molecules',
    options: [
      {
        id: 'system_concentration',
        min: 0,
        max: 1e9,
        step: 1e7,
        default: 2e8,
        label: 'System Concentration (antiTNFa)',
        units: 'aM',
        module: 'antitnfa',
        experimental: true,
      },
      // {
      //   id: 'system_concentration',
      //   min: 0,
      //   max: 0.00001,
      //   step: 0.000001,
      //   default: 0.000000,
      //   label: 'System Concentration (ESTb)',
      //   units: 'nM',
      //   module: 'estb',
      //   experimental: true,
      // },
    ],
    subsections: {
      TNFa: [
        {
          id: 'macrophage_secretion_rate',
          min: 0,
          max: 10.0e-2,
          step: 0.01e-2,
          default: 3.22e-2,
          label: 'Macrophage Secretion Rate',
          units: 'atto-mol/(cell*h)',
          module: 'tnfa',
          experimental: true,
        },
        {
          id: 'neutrophil_secretion_rate',
          min: 0,
          max: 10.0e-2,
          step: 0.01e-4,
          default: 1.89e-4,
          label: 'Neutrophil Secretion Rate',
          units: 'atto-mol/(cell*h)',
          module: 'tnfa',
          experimental: true,
        },
        {
          id: 'epithelial_secretion_rate',
          min: 0,
          max: 10.0e-2,
          step: 0.01e-2,
          default: 3.22e-2,
          label: 'Epithelial Secretion Rate',
          units: 'atto-mol/(cell*h)',
          module: 'tnfa',
          experimental: true,
        },
      ],
    },
  },
};
