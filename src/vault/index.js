// Explicit raw imports — works reliably in all Vite versions.
// Add a new line here whenever you drop a new .md file into this folder.
import pragmaticProgrammer from './The-Pragmatic-Programmer.md?raw'
import ch1 from './Ch1-A-Pragmatic-Philosophy.md?raw'
import ch2 from './Ch2-A-Pragmatic-Approach.md?raw'
import ch3 from './Ch3-The-Basic-Tools.md?raw'
import ch4 from './Ch4-A-Pragmatic-Paranoia.md?raw'
import ch5 from './Ch5-Bend-or-Break.md?raw'
import ch6 from './Ch6-While-You-Are-Coding.md?raw'
import ch7 from './Ch7-Before-the-Project.md?raw'
import ch8 from './Ch8-Pragmatic-Projects.md?raw'
import quickRef from './Quick-Reference.md?raw'

const vault = {
  'The-Pragmatic-Programmer': pragmaticProgrammer,
  'Ch1-A-Pragmatic-Philosophy': ch1,
  'Ch2-A-Pragmatic-Approach': ch2,
  'Ch3-The-Basic-Tools': ch3,
  'Ch4-A-Pragmatic-Paranoia': ch4,
  'Ch5-Bend-or-Break': ch5,
  'Ch6-While-You-Are-Coding': ch6,
  'Ch7-Before-the-Project': ch7,
  'Ch8-Pragmatic-Projects': ch8,
  'Quick-Reference': quickRef,
}

export default vault
