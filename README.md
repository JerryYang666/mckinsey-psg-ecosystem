# Ecosystem Simulator

A React-based simulator for modeling food chain dynamics and species interactions. This tool allows users to create and simulate a simple ecosystem with producers and consumers, tracking caloric exchanges and survival rates.

## Features

### Species Management
- Support for 8 species:
  - 5 Animals (consumers)
  - 3 Producers
- Each species has the following attributes:
  - Name
  - Calories Provided (energy output)
  - Calories Needed (energy input)
  - Food Sources (what the species eats)

### Simulation Controls
- **Save Initial Values**: Lock in starting conditions for future resets
- **Run One Step**: Execute a single feeding cycle
- **Reset**: Return all species to their saved initial state

### Visual Display
- **Food Chain Display**: Visual representation of the ecosystem
  - Color-coded cards for different species types:
    - Yellow: Animals
    - Green: Producers
    - Red: Dead species
  - Status indicators:
    - "Has eaten this step" badge
    - Death state (red background)
- **Step History**: Chronological log of feeding events

### Simulation Rules

The simulation follows these core rules:

1. **Feeding Priority**: 
   - Species with the highest current Calories Provided eats first
   - Only one species feeds per step

2. **Food Source Selection**:
   - Species eat from their available food sources
   - When multiple food sources have equal calories, feeding is distributed equally

3. **Calorie Exchange**:
   - When eating occurs:
     - Food source's Calories Provided decreases by the amount eaten
     - Eating species' Calories Needed decreases by the amount consumed
   - Species dies when Calories Provided reaches 0

## Usage

1. **Initial Setup**:
   - Fill in details for all 8 species
   - Click "Save Initial Values" to store starting conditions

2. **Running Simulation**:
   - Click "Run One Step" to execute one feeding cycle
   - Monitor the Step History for feeding events
   - Watch for species deaths (red cards) and feeding indicators

3. **Reset & Modify**:
   - Use Reset to return to saved initial values
   - Modify species attributes as needed
   - Save new initial values if desired

## Technical Implementation

Built using:
- React
- Tailwind CSS
- shadcn/ui components

Key features:
- Responsive design
- Real-time updates
- State management for species attributes
- Visual feedback for simulation events

## Future Enhancements
Potential areas for improvement:

- Multiple feeding cycles per step
- Population dynamics
- Reproduction mechanics
- Environmental factors
- Export/import of ecosystem configurations
- Visual representation of food web connections
- Statistical analysis of ecosystem stability

## Contributing

Feel free to submit issues and enhancement requests. Pull requests are welcome with:
- Clear description of changes
- No breaking changes to core simulation rules
- Maintained code style
- Updated documentation

## License

MIT