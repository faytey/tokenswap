use starknet::ContractAddress;

#[starknet::interface]
trait ISwap<TContractState> {
    fn swap_init_tokens_for_swapper_tokens(ref self: TContractState, amount_of_init: u128);
    fn swap_swapper_tokens_for_init_tokens(ref self: TContractState, amount_of_swapper: u128);
    fn get_init_to_swapper_ratio(self: @TContractState) -> u128;
    fn get_swapper_to_init_ratio(self: @TContractState) -> u128;
}

#[starknet::contract]
mod Swapper {
    use core::option::OptionTrait;
    use core::traits::TryInto;
    use starknet::{ContractAddress, get_caller_address, get_contract_address};
    use super::{ISwap};
    use swapper::init_token::{ITokenDispatcher, ITokenDispatcherTrait};
    use swapper::swap_token::{ISwapTokenDispatcher, ISwapTokenDispatcherTrait};

    #[storage]
    struct Storage {}

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event{
        Swapped: Swapped,
    }

    #[derive(Drop, starknet::Event)]
    struct Swapped {
        #[key]
        from: ContractAddress,
        to: ContractAddress,
        amount: u128,
        swap: u128
    }

    #[external(v0)]
    impl ISwapImpl of ISwap<ContractState> {
        fn swap_init_tokens_for_swapper_tokens(ref self: ContractState, amount_of_init: u128) {
            let init: ContractAddress = 0x0001a5cf7662dd884123aa8020f417521152789a1d01b0ef1188a25461decca7.try_into().unwrap();
            let swap: ContractAddress = 0x0571ce0e4d85fb6b0406fad82996ea8dead2700812c3521227f4e8a66ff8dc79.try_into().unwrap();
            let init_token =  ITokenDispatcher {contract_address: init};
            let swap_token =  ISwapTokenDispatcher {contract_address: swap};
            let user: ContractAddress = get_caller_address();
            let contract: ContractAddress = get_contract_address();
            
            assert(init_token.get_balance_of_user(user) >= amount_of_init, 'Not enough Init Tokens');
            
            let swapped_value = (amount_of_init * 100000) / 1000000;

            let total_swap = amount_of_init - swapped_value;
            
            assert(swap_token.get_balance_of_user(contract) >= total_swap, 'Not enough contract balance');
            
            init_token.transfer_from(user, contract, amount_of_init);
            swap_token.mint(contract);
            swap_token.transfer(user, total_swap);
            self.emit(Swapped {from: init, to: swap, amount: amount_of_init, swap: total_swap});
        }

        fn swap_swapper_tokens_for_init_tokens(ref self: ContractState, amount_of_swapper: u128) {
            let init: ContractAddress = 0x0001a5cf7662dd884123aa8020f417521152789a1d01b0ef1188a25461decca7.try_into().unwrap();
            let swap: ContractAddress = 0x0571ce0e4d85fb6b0406fad82996ea8dead2700812c3521227f4e8a66ff8dc79.try_into().unwrap();
            let init_token =  ITokenDispatcher {contract_address: init};
            let swap_token =  ISwapTokenDispatcher {contract_address: swap};
            let user: ContractAddress = get_caller_address();
            
            assert(swap_token.get_balance_of_user(user) >= amount_of_swapper, 'Not enough Swapper Tokens');
            
            let swapped_value = (amount_of_swapper * 10) / 100;

            let total_swap = amount_of_swapper + swapped_value;
            
            assert(init_token.get_balance_of_user(get_contract_address()) >= total_swap, 'Not enough contract balance');
            
            swap_token.transfer_from(user, get_contract_address(), amount_of_swapper);
            init_token.mint(get_contract_address());
            init_token.transfer(user, total_swap);
            self.emit(Swapped {from: swap, to: init, amount: amount_of_swapper, swap: total_swap});
        }
        
        fn get_init_to_swapper_ratio(self: @ContractState) -> u128{
            let init_token =  1000_u128;
            let swap_token =  900_u128;
            let ratio: u128 = init_token / swap_token;
            ratio
        }

        fn get_swapper_to_init_ratio(self: @ContractState) -> u128 {
            let swap_token =  900_u128;
            let init_token =  1000_u128;
            let ratio: u128 = swap_token/init_token;
            ratio
        }
    }
}