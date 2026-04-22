# Pipeline Hazard Simulator

An interactive, high-fidelity web application designed to simulate and visualize pipeline hazards in computer architecture. Built with **React**, **Vite**, and **Framer Motion**, this simulator features a futuristic "space station deck" aesthetic and provides a deep dive into instruction flow, hazard detection, and resolution strategies.

## 🚀 Features

- **Interactive Pipeline Grid**: Visualize 4-stage and 5-stage pipeline executions.
- **Hazard Detection**: Real-time identification of RAW (Read-After-Write) hazards.
- **Resolution Strategies**: Toggle between **Stalling** and **Data Forwarding** to see how hazards are handled.
- **Dynamic Diagnostics**: Detailed hazard panels showing exactly where and why a stall or forward occurred.
- **Futuristic UI**: A premium dark-mode interface with smooth animations and micro-interactions.

## 🛠️ Tech Stack

- **Framework**: React 19
- **Bundler**: Vite
- **Styling**: Tailwind CSS 4
- **Animations**: Framer Motion
- **Icons**: Lucide React

## 📥 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- npm (comes with Node.js)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Rejin18077/FOCS-Assignment.git
   ```

2. **Navigate to the project directory:**
   ```bash
   cd FOCS-Assignment
   ```

3. **Install dependencies:**
   ```bash
   npm install
   ```

### Running Locally

To start the development server:
```bash
npm run dev
```
Once started, the application will be available at `http://localhost:5173`.

### Building for Production

To create an optimized production build:
```bash
npm run build
```

## 📖 How to Use

1. **Enter Instructions**: Use the instruction panel to input assembly-like instructions (e.g., `ADD R1, R2, R3`).
2. **Configure Pipeline**: Choose between different pipeline stages and toggle forwarding on/off.
3. **Step Through**: Use the controls to step through the cycles or run the simulation automatically.
4. **Analyze Hazards**: Observe the hazard panel at the bottom to see detailed diagnostics of stalls and data forwarding.

---

Built as part of the **FOCS Assignment**.
