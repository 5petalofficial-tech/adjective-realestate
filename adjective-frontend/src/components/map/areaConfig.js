export const AREAS = {
  "Action Area I": {
    center: [22.5730, 88.4630],
    zoom: 14,
    // Action Area I: New Town's south-west planning unit, around the
    // Business Club, Ecospace, Axis Mall and the AA-I residential blocks.
    polygon: [
      [22.5910, 88.4460],
      [22.5910, 88.4650],
      [22.5810, 88.4860],
      [22.5630, 88.4820],
      [22.5590, 88.4730],
      [22.5620, 88.4630],
      [22.5680, 88.4570],
      [22.5700, 88.4490],
      [22.5790, 88.4450],
    ],
  },

  "Action Area II": {
    // Centred on the Action Area II locality (near Eco Park / CBD II).
    center: [22.6037, 88.4719],
    zoom: 14,
    // Landmark-aligned outline covering the Action Area II sectors (II-A–II-G).
    // It follows the New Town / Eco Park corridor rather than the old
    // south-east-only approximation.
    polygon: [
      [22.6320, 88.4430],
      [22.6340, 88.4610],
      [22.6250, 88.4790],
      [22.6100, 88.4930],
      [22.5880, 88.4920],
      [22.5780, 88.4850],
      [22.5830, 88.4710],
      [22.6030, 88.4510],
      [22.6210, 88.4430],
    ],
  },

  "Action Area III": {
    center: [22.5600, 88.5000],
    zoom: 14,
    // Action Area III: New Town's south-east planning unit, including the
    // Shapoorji/Rosedale and university corridor.
    polygon: [
      [22.5700, 88.4880],
      [22.5700, 88.4940],
      [22.5690, 88.5210],
      [22.5510, 88.5220],
      [22.5460, 88.5020],
      [22.5510, 88.4790],
    ],
  },

  Rajarhat: {
    center: [22.6286, 88.4406],
    zoom: 13,
    // Rajarhat's established north-western core. New Town's Action Areas are
    // separate planning units and are deliberately excluded from this shape.
    polygon: [
      [22.6580, 88.4190],
      [22.6630, 88.4470],
      [22.6500, 88.4690],
      [22.6280, 88.4720],
      [22.6120, 88.4550],
      [22.6130, 88.4330],
      [22.6280, 88.4170],
    ],
  },
};
