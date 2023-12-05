#[cfg(test)]
mod tests {
    use core::option::OptionTrait;
    use core::traits::TryInto;
    use snforge_std::{declare, ContractClassTrait, start_prank, stop_prank};
    use swapper::swapper::{ISwapDispatcher, ISwapDispatcherTrait};
    use swapper::swap_token::{ISwapTokenDispatcher, ISwapTokenDispatcherTrait};
    use swapper::init_token::{ITokenDispatcher, ITokenDispatcherTrait};
    use core::array::ArrayTrait;
    use starknet::{ContractAddress,get_caller_address, get_contract_address};

    // #[test]
    fn setup() -> ContractAddress {
        // First declare and deploy a contract
        let contract = declare('SwapToken');
        // Initialize Constructor
        let mut deploy = ArrayTrait::new();
        let contract_address = contract.precalculate_address(@deploy);
        let owner: ContractAddress = 0x03af13f04C618e7824b80b61e141F5b7aeDB07F5CCe3aD16Dbd8A4BE333A3Ffa.try_into().unwrap();
        start_prank(contract_address, owner);
        let deployed = contract.deploy(@deploy).unwrap();
        deployed;
        stop_prank(contract_address);
        deployed
    }

     fn setup_one() -> ContractAddress {
        // First declare and deploy a contract
        let contract = declare('InitToken');
        // Initialize Constructor
        let mut deploy = ArrayTrait::new();
        let contract_address = contract.precalculate_address(@deploy);
        let owner: ContractAddress = 0x03af13f04C618e7824b80b61e141F5b7aeDB07F5CCe3aD16Dbd8A4BE333A3Ffa.try_into().unwrap();
        start_prank(contract_address, owner);
        let deployed = contract.deploy(@deploy).unwrap();
        deployed;
        stop_prank(contract_address);
        deployed
    }

     fn setup_two() -> ContractAddress {
        // First declare and deploy a contract
        let contract = declare('Swapper');
        // Initialize Constructor
        let mut deploy = ArrayTrait::new();
        let contract_address = contract.precalculate_address(@deploy);
        let owner: ContractAddress = 0x03af13f04C618e7824b80b61e141F5b7aeDB07F5CCe3aD16Dbd8A4BE333A3Ffa.try_into().unwrap();
        start_prank(contract_address, owner);
        let deployed = contract.deploy(@deploy).unwrap();
        deployed;
        stop_prank(contract_address);
        deployed
    }

    #[test]
    fn test_swap_init_to_swapper() {
        let contract_address = setup_two();
        let contract_address_one = setup_one();
        let contract_address_two = setup();
        let user: ContractAddress = 0x03af13f04C618e7824b80b61e141F5b7aeDB07F5CCe3aD16Dbd8A4BE333A3Ffa.try_into().unwrap();
        let init_token =  ITokenDispatcher {contract_address: contract_address_one};
        let swap_token =  ISwapTokenDispatcher {contract_address: contract_address_two};

        // Create a Dispatcher object that will allow interacting with the deployed contract
        let dispatcher = ISwapDispatcher { contract_address: contract_address };
        start_prank(contract_address, user);
        init_token.mint(user);
        assert(init_token.get_balance_of_user(user) != 0, 'Insufficient');
        assert(swap_token.get_balance_of_user(user) == 0, 'balance is 0');
        // Call a view function of the contract
        start_prank(contract_address_one, user);
        init_token.approval(contract_address_one, 1000);
        assert(init_token.allowance(user, contract_address_one) != 0, 'allowance is 0');
        stop_prank(contract_address_one);
        let swapper = dispatcher.swap_init_tokens_for_swapper_tokens(1000);
        assert(init_token.get_balance_of_user(user) == 0, 'Error in swap');
        assert(swap_token.get_balance_of_user(user) != 0, 'Errored');
        stop_prank(contract_address);
    }
}