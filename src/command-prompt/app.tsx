import Command from "../command";

import {
    Command as CommandComponent,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandShortcut,
  } from "../components/command"

const App: React.FC = () => {
    const queryString = global.location.search;
    const urlParams = new URLSearchParams(queryString);
    const commandsParam = urlParams.get('commands');

    return (
        <CommandComponent className="rounded-lg border">
          <CommandInput autoFocus={true} placeholder="Search..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Settings">
              <CommandItem>
                <span>{commandsParam}</span>
                <CommandShortcut>⌘P</CommandShortcut>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </CommandComponent>
    );
}

export default App;
