# MIPS Pipeline Hazard Simulator - Lab Assignment Report

## 📋 Project Overview
This project is an interactive MIPS Pipeline Simulator designed to visualize and analyze pipeline hazards, specifically focusing on **Data Hazards (RAW)** and their resolution through **Stalling** and **Data Forwarding**. The simulator supports both 4-stage and 5-stage pipeline configurations and provides a real-time cycle-by-cycle visualization of instruction flow.

## 🎯 Project Goals
- To demonstrate the impact of data dependencies on pipeline performance.
- To visualize the propagation of stalls through the pipeline.
- To show how data forwarding (bypass) can minimize or eliminate stalls.
- To implement realistic hardware assumptions such as split-phase register access.

---

## ⚙️ Hardware Assumptions & Logic

### 1. Split-Phase Register Access
The simulator implements **split-cycle register access**. This means:
- **Write-Back (WB)** happens in the **first half** of the clock cycle.
- **Instruction Decode (ID)** reads registers in the **second half** of the clock cycle.
- **Effect**: If instruction $I_1$ is in WB and instruction $I_2$ is in ID in the same cycle, $I_2$ can read the value written by $I_1$ without any stall.

### 2. Forwarding Logic
When forwarding is enabled, the simulator bypasses data from the following buffers:
- **EX/MEM Buffer**: Forwards result directly to the ALU input for the next instruction.
- **MEM/WB Buffer**: Forwards result to the ALU input or Branch comparator.
- **Load-Use Rule**: If a `LW` instruction is followed by an instruction using that register, a **1-cycle stall** is mandatory because the data is not available until the end of the MEM stage.

### 3. Structural Constraints
- **Fetch Limit**: Only one instruction can be fetched per cycle.
- **ALU Limit**: Only one instruction can occupy the EX stage at any given time.
- **Stall Propagation**: If an instruction stalls in the ID stage, the Fetch unit (IF) is also stalled to prevent overwriting the instruction buffer.

---

## 🧪 Test Case Documentation

The following test cases were used to validate the accuracy of the simulator logic.

### Test Case 5: Load-Use Hazard (Forwarding ON)
**Sequence:**
1. `LW R1, 0(R2)`
2. `ADD R3, R1, R4`
3. `SUB R5, R3, R6`

**Observed Schedule:**
| Instruction | C1 | C2 | C3 | C4 | C5 | C6 | C7 | C8 |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| `LW R1, 0(R2)` | IF | ID | EX | MEM | WB | | | |
| `ADD R3, R1, R4` | | IF | ID | **STALL** | EX | MEM | WB | |
| `SUB R5, R3, R6` | | | IF | **STALL** | ID | EX | MEM | WB |

*Analysis: I2 stalls once at C4 because R1 data from LW is only available after MEM (C4). I3 is forced to stall at C4 because I2 is still occupying the ID stage.*

### Test Case 6: Store Dependency (Forwarding ON)
**Sequence:**
1. `LW R8, 4(R2)`
2. `ADD R9, R8, R6`
3. `SW R9, 0(R10)`

**Observed Schedule:**
| Instruction | C1 | C2 | C3 | C4 | C5 | C6 | C7 | C8 |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| `LW R8, 4(R2)` | IF | ID | EX | MEM | WB | | | |
| `ADD R9, R8, R6` | | IF | ID | **STALL** | EX | MEM | WB | |
| `SW R9, 0(R10)` | | | IF | **STALL** | ID | EX | MEM | WB |

*Analysis: Similar to TC5, the ADD must wait for LW data. The SW can then receive R9 via forwarding from the ADD's EX stage.*

### Test Case 7: Extended Sequence (Forwarding ON)
**Sequence:**
1. `LW R1, 0(R2)`
2. `ADD R3, R1, R4`
3. `SUB R5, R3, R6`
4. `LW R7, 4(R2)`

**Observed Schedule:**
| Instruction | C1 | C2 | C3 | C4 | C5 | C6 | C7 | C8 | C9 |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| `LW R1, 0(R2)` | IF | ID | EX | MEM | WB | | | | |
| `ADD R3, R1, R4` | | IF | ID | **STL** | EX | MEM | WB | | |
| `SUB R5, R3, R6` | | | IF | **STL** | ID | EX | MEM | WB | |
| `LW R7, 4(R2)` | | | | | IF | ID | EX | MEM | WB |

---

## 🚀 How to Run Test Cases

1. **Setup Environment**:
   ```bash
   npm install
   npm run dev
   ```
2. **Select Pipeline Type**: Use the configuration panel to select **5-stage**.
3. **Toggle Forwarding**: Ensure the **Data Forwarding** switch is **ON** (or OFF to see the increased stall count).
4. **Input Instructions**: Enter the instructions exactly as shown in the test cases (e.g., `LW R1, 0(R2)`).
5. **Run Simulation**: Click the **Run** button or use the **Next Cycle** button to observe the cycle-by-cycle transitions.
6. **Verify Results**: Compare the resulting grid with the tables provided in this report.

## 🛠️ Implementation Details

- **Scheduler**: The core logic in `scheduler.js` uses a constraint-based timing algorithm. It calculates the earliest possible cycle for each stage based on structural limits and data dependencies.
- **Hazard Detector**: The `hazardDetector.js` module performs a backward search through the instruction stream to identify RAW hazards.
- **Visualization**: Built using **Tailwind CSS** for the grid and **SVG** for dynamic forwarding path arrows.

---
**Course**: FOCS - Lab Assignment II  
**Author**: Rejin (Student ID: 18077)
