export const spaces = [
  'A1', 'A2', 'A3', 'A4', 'A5',
  'B1', 'B2', 'B3', 'B4', 'B5',
  'C1', 'C2', 'C3', 'C4', 'C5'
];

export const empty_spaces = (farmyard) => {
  return spaces.filter(id => farmyard[id] == null);
};

