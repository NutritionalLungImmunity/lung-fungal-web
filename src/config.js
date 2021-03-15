export default {
  properties: {
    title: 'Simulation Properties',
    modules: {
      simulation: [{
        id: 'run_time',
        min: 1,
        max: 1000,
        default: 96,
        label: 'Simulation world time',
        help: 'Simulation world time (hours) as opposed to real world time',
        units: 'hours',
      }, {
        id: 'validate',
        type: 'checkbox',
        default: true,
        label: 'Perform validation per time step',
      }],
      fungus: [{
        id: 'init_num',
        min: 1,
        max: 2000,
        step: 1,
        default: 70,
        label: 'Initial count of Fungal spores',
      }],
    },
  },
  macrophage: {
    title: 'Macrophage',
    modules: {
      rates: [
        {
          id: 'm_abs',
          min: 0,
          max: 1,
          step: 0.01,
          default: 0.05,
          label: 'Uptake rate of cytokine',
        },
        {
          id: 'Mn',
          min: 0,
          max: 100,
          default: 2.0,
          label: 'Production rate of neutrophil cytokine',
        },
        {
          id: 'rec_rate_ph',
          min: 0,
          max: 10,
          default: 6,
          label: 'Macrophages recruited',
          help: 'Number of macrophages recruited per time step',
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
        },
        {
          id: 'p_internalization',
          min: 0,
          max: 1,
          step: 0.01,
          default: 0.15,
          label: 'Probability of internalization',
        },
        {
          id: 'rm',
          min: 0,
          max: 1,
          step: 0.01,
          default: 0.1,
          label: 'Proportion of sporeless fungal cells to remove',
        },
      ],
      misc: [
        {
          id: 'rec_r',
          min: 0,
          max: 100,
          default: 3,
          label: 'Cytokine recruitment threshold',
        },
        {
          id: 'kill',
          min: 1,
          max: 100,
          step: 1,
          default: 2,
          label: 'Time steps to kill conidia',
          help: 'Number of time steps to kill conidia',
        },
        {
          id: 'm_det',
          min: 0,
          max: 40,
          default: 1,
          label: 'Radius of detection',
          help: 'Macrophage radius of detection',
          units: 'voxels',
        },
        {
          id: 'max_conidia_in_phag',
          min: 1,
          max: 100,
          default: 50,
          label: 'Max number of conidia in phagocyte',
          help: 'Maximum number of conidia in phagocyte',
        },
      ]
    }
  },
  neutrophil: {
    title: 'Neutrophil',
    modules: {
      rates: [
        {
          id: 'rec_rate_ph',
          min: 0,
          max: 30,
          step: 1,
          default: 18,
          label: 'Neutrophils recruited',
          help: 'TODO',
        }, {
          id: 'rec_r',
          min: 0,
          max: 30,
          step: 1,
          default: 5,
          label: 'Neutrophils recruited',
          help: 'TODO',
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
        },
      ],
      misc: [
        {
          id: 'neutropenic',
          type: 'checkbox',
          default: false,
          label: 'Host is neutropenic',
        },
        {
          id: 'Nn',
          min: 0,
          max: 10,
          step: 0.1,
          default: 2,
          label: 'Neutrophil produce neutrophil cytokine',
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
        }, {
          id: 'granule_count',
          min: 0,
          max: 1000,
          step: 1,
          default: 100,
          label: 'Initial neutrophil granuals',
          help: 'Initial number of neutrophil granuals',
        }, {
          id: 'n_kill',
          min: 1,
          max: 100,
          step: 1,
          default: 2,
          label: 'Time taken to kill hyphae',
          help: 'Time taken for neutrophil to kill hyphae',
        }, {
          id: 'age_limit',
          min: 1,
          max: 100,
          default: 36,
          label: 'Neutrophil age limit',
        }
      ]
    }
  },
  epithelium: {
    title: 'Epithelium',
    modules: {
      rates: [
        {
          id: 'cyto_rate',
          min: 1,
          max: 200,
          default: 100,
          label: 'Cytokine production factor',
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
        }
      ],
      misc: [
        {
          id: 'e_kill',
          min: 1,
          max: 100,
          default: 30,
          label: 'Time taken to kill internal spore',
        },
        {
          id: 's_det',
          min: 0,
          max: 10,
          step: 1,
          default: 1,
          label: 'Spore detection radius',
          units: 'voxels',
        },
        {
          id: 'h_det',
          min: 0,
          max: 10,
          step: 1,
          default: 1,
          label: 'Hyphae detection radius',
          units: 'voxels',
        },
        {
          id: 'max_condia_in_phag',
          min: 0,
          max: 100,
          default: 10,
          label: 'Maximum conidia in phag',
        }, 
      ]
    }
  },
  fungus: {
    title: 'Fungus',
    modules: {
      rates: [
        {
          id: 'iron_absorb',
          min: 0,
          max: 10,
          step: 1,
          default: 1,
          label: 'Iron absorbtion rate',
          help: 'TODO',
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
        },
        {
          id: 'p_internal_swell',
          min: 0,
          max: 1,
          step: 0.01,
          default: 0.2,
          label: 'Probability of swelling when internalized',
        },
        {
          id: 'p_branch',
          min: 0,
          max: 1,
          step: 0.01,
          default: 0.35,
          label: 'Probability of branching',
        },
        {
          id: 'p_internalize',
          min: 0,
          max: 1,
          step: 0.01,
          default: 0.3,
          label: 'Probability of internalization',
        },
      ],
      misc: [
        {
          id: 'init_health',
          min: 0,
          max: 100,
          default: 100,
          label: 'init_health',
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
        }
      ]
    }
  },
  molecules: {
    title: 'Molecules',
    modules: {
      rates: [
        {
          id: 'diffusion_rate',
          min: 0,
          max: 1,
          step: 0.01,
          default: 0.8,
          label: 'Molecule diffusion rate',
        }, {
          id: 'cyto_evap_m',
          min: 0,
          max: 1,
          step: 0.01,
          default: 0.2,
          label: 'Macrophage cytokine evaporation rate',
        }, {
          id: 'cyto_evap_n',
          min: 0,
          max: 1,
          step: 0.01,
          default: 0.2,
          label: 'Neutrophil cytokine evaporation rate',
        }
      ],
    }
  },
};
