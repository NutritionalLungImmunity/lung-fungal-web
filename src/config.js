export default {
  properties: {
    title: 'Main Settings',
    options: [
      {
        id: 'run_time',
        min: 1,
        max: 336,
        default: 96,
        label: 'Simulation world time',
        help: 'Simulated world time in hours',
        units: 'hours',
        module: 'simulation',
        experimental: false,
      },
      {
        id: 'runs_per_config',
        min: 1,
        max: 100,
        default: 1,
        label: 'Number of simulations to run',
        units: 'per configuration',
        module: 'simulation',
        experimental: false,
      },
      {
        id: 'init_num',
        min: 1,
        max: 2000,
        step: 1,
        default: 70,
        label: 'Initial count of Fungal spores',
        module: 'fungus',
        experimental: true,
      },
      {
        id: 'validate',
        type: 'checkbox',
        default: true,
        label: 'Perform validation per time step',
        module: 'simulation',
        experimental: false,
      },
    ],
    subsections: {},
  },
  macrophage: {
    title: 'Macrophage',
    options: [],
    subsections: {
      rates: [
        {
          id: 'm_abs',
          min: 0,
          max: 1,
          step: 0.01,
          default: 0.05,
          label: 'Uptake rate of cytokine',
          module: 'macrophage',
          experimental: true,
        },
        {
          id: 'Mn',
          min: 0,
          max: 100,
          default: 2.0,
          label: 'Production rate of neutrophil cytokine',
          module: 'macrophage',
          experimental: true,
        },
        {
          id: 'rec_rate_ph',
          min: 0,
          max: 10,
          default: 6,
          label: 'Macrophages recruited',
          help: 'Number of macrophages recruited per time step',
          module: 'macrophage',
          experimental: true,
        },
      ],
      probabilities: [
        {
          id: 'p_rec_r',
          min: 0,
          max: 1,
          step: 0.01,
          default: 1.0,
          label: 'Probability of appearence',
          module: 'macrophage',
          experimental: true,
        },
        {
          id: 'p_internalization',
          min: 0,
          max: 1,
          step: 0.01,
          default: 0.15,
          label: 'Probability of internalization',
          module: 'macrophage',
          experimental: true,
        },
        {
          id: 'rm',
          min: 0,
          max: 1,
          step: 0.01,
          default: 0.1,
          label: 'Proportion of sporeless fungal cells to remove',
          module: 'macrophage',
          experimental: true,
        },
      ],
      misc: [
        {
          id: 'rec_r',
          min: 0,
          max: 100,
          default: 3,
          label: 'Cytokine recruitment threshold',
          module: 'macrophage',
          experimental: true,
        },
        {
          id: 'kill',
          min: 1,
          max: 100,
          step: 1,
          default: 2,
          label: 'Time steps to kill conidia',
          help: 'Number of time steps to kill conidia',
          module: 'macrophage',
          experimental: true,
        },
        {
          id: 'm_det',
          min: 0,
          max: 40,
          default: 1,
          label: 'Radius of detection',
          help: 'Macrophage radius of detection',
          units: 'voxels',
          module: 'macrophage',
          experimental: true,
        },
        {
          id: 'max_conidia_in_phag',
          min: 1,
          max: 100,
          default: 50,
          label: 'Max number of conidia in phagocyte',
          help: 'Maximum number of conidia in phagocyte',
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
        id: 'neutropenic',
        type: 'checkbox',
        default: false,
        label: 'Host is neutropenic',
        module: 'neutrophil',
        experimental: false,
      },
    ],
    subsections: {
      rates: [
        {
          id: 'rec_rate_ph',
          min: 0,
          max: 30,
          step: 1,
          default: 18,
          label: 'Neutrophils recruited by phagocytes',
          help: 'TODO',
          module: 'neutrophil',
          experimental: true,
        }, {
          id: 'rec_r',
          min: 0,
          max: 30,
          step: 1,
          default: 5,
          label: 'Neutrophils recruited',
          help: 'TODO',
          module: 'neutrophil',
          experimental: true,
        },
      ],
      probabilities: [
        {
          id: 'n_absorb',
          min: 0,
          max: 1,
          step: 0.01,
          default: 0.05,
          label: 'Neutrophil absorb cytokines',
          help: 'Probability',
          module: 'neutrophil',
          experimental: true,
        },
      ],
      misc: [
        {
          id: 'Nn',
          min: 0,
          max: 10,
          step: 0.1,
          default: 2,
          label: 'Neutrophil produce neutrophil cytokine',
          module: 'neutrophil',
          experimental: true,
        },
        {
          id: 'n_det',
          min: 0,
          max: 10,
          step: 1,
          default: 1,
          label: 'Radius of detection',
          help: 'Neutrophil radius of detection',
          units: 'voxels',
          module: 'neutrophil',
          experimental: true,
        }, {
          id: 'granule_count',
          min: 0,
          max: 1000,
          step: 1,
          default: 100,
          label: 'Initial neutrophil granuals',
          help: 'Initial number of neutrophil granuals',
          module: 'neutrophil',
          experimental: true,
        }, {
          id: 'n_kill',
          min: 1,
          max: 100,
          step: 1,
          default: 2,
          label: 'Time taken to kill hyphae',
          help: 'Time taken for neutrophil to kill hyphae',
          module: 'neutrophil',
          experimental: true,
        }, {
          id: 'age_limit',
          min: 1,
          max: 100,
          default: 36,
          label: 'Neutrophil age limit',
          module: 'neutrophil',
          experimental: true,
        },
      ],
    },
  },
  epithelium: {
    title: 'Epithelium',
    options: [],
    subsections: {
      rates: [
        {
          id: 'cyto_rate',
          min: 1,
          max: 200,
          default: 100,
          label: 'Cytokine production factor',
          module: 'epithelium',
          experimental: true,
        },
      ],
      probabilities: [
        {
          id: 'p_internalization',
          min: 0,
          max: 1,
          step: 0.01,
          default: 0.03,
          label: 'p_internalization',
          module: 'epithelium',
          experimental: true,
        },
      ],
      misc: [
        {
          id: 'e_kill',
          min: 1,
          max: 100,
          default: 30,
          label: 'Time taken to kill internal spore',
          module: 'epithelium',
          experimental: true,
        },
        {
          id: 's_det',
          min: 0,
          max: 10,
          step: 1,
          default: 1,
          label: 'Spore detection radius',
          units: 'voxels',
          module: 'epithelium',
          experimental: true,
        },
        {
          id: 'h_det',
          min: 0,
          max: 10,
          step: 1,
          default: 1,
          label: 'Hyphae detection radius',
          units: 'voxels',
          module: 'epithelium',
          experimental: true,
        },
        {
          id: 'max_condia_in_phag',
          min: 0,
          max: 100,
          default: 10,
          label: 'Maximum conidia in phag',
          module: 'epithelium',
          experimental: true,
        },
      ],
    },
  },
  fungus: {
    title: 'Fungus',
    options: [],
    subsections: {
      rates: [
        {
          id: 'iron_absorb',
          min: 0,
          max: 10,
          step: 1,
          default: 1,
          label: 'Iron absorbtion rate',
          help: 'TODO',
          module: 'fungus',
          experimental: true,
        },
      ],
      probabilities: [
        {
          id: 'p_lodge',
          min: 0,
          max: 1,
          step: 0.01,
          default: 1.0,
          label: 'Probability of lodging in the epithelium',
          module: 'fungus',
          experimental: true,
        },
        {
          id: 'p_internal_swell',
          min: 0,
          max: 1,
          step: 0.01,
          default: 0.2,
          label: 'Probability of swelling when internalized',
          module: 'fungus',
          experimental: true,
        },
        {
          id: 'p_branch',
          min: 0,
          max: 1,
          step: 0.01,
          default: 0.35,
          label: 'Probability of branching',
          module: 'fungus',
          experimental: true,
        },
        {
          id: 'p_internalize',
          min: 0,
          max: 1,
          step: 0.01,
          default: 0.3,
          label: 'Probability of internalization',
          module: 'fungus',
          experimental: true,
        },
      ],
      misc: [
        {
          id: 'init_health',
          min: 0,
          max: 100,
          default: 100,
          label: 'init_health',
          module: 'fungus',
          experimental: true,
        },
        {
          id: 'grow_time',
          min: 1,
          max: 10,
          step: 1,
          default: 2,
          label: 'Duration of growth stage',
          help: 'Duration of growth stage in minutes',
          units: 'minutes',
          module: 'fungus',
          experimental: true,
        },
        {
          id: 'rest_time',
          min: 1,
          max: 10,
          step: 1,
          default: 1,
          label: 'Duration of resting stage',
          help: 'Duration of resting stage in minutes',
          units: 'minutes',
          module: 'fungus',
          experimental: true,
        },
        {
          id: 'swell_time',
          min: 1,
          max: 10,
          step: 1,
          default: 5,
          label: 'Duration of swollen stage',
          help: 'Duration of swollen stage in minutes',
          units: 'minutes',
          module: 'fungus',
          experimental: true,
        },
      ],
    },
  },
  molecules: {
    title: 'Molecules',
    options: [],
    subsections: {
      rates: [
        {
          id: 'diffusion_rate',
          min: 0,
          max: 1,
          step: 0.01,
          default: 0.8,
          label: 'Molecule diffusion rate',
          module: 'molecules',
          experimental: true,
        }, {
          id: 'cyto_evap_m',
          min: 0,
          max: 1,
          step: 0.01,
          default: 0.2,
          label: 'Macrophage cytokine evaporation rate',
          module: 'molecules',
          experimental: true,
        }, {
          id: 'cyto_evap_n',
          min: 0,
          max: 1,
          step: 0.01,
          default: 0.2,
          label: 'Neutrophil cytokine evaporation rate',
          module: 'molecules',
          experimental: true,
        },
      ],
    },
  },
};
