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
            let init: ContractAddress = 0x0029820fc9c9d7fc0ce55ecf67f1dfe2e6575f2e54d7a25f0e942e67f45ee12e.try_into().unwrap();
            let swap: ContractAddress = 0x0423c66315527dd9031aa18614ad98f863c057077700a3003dd88be50b207500.try_into().unwrap();
            let init_token =  ITokenDispatcher {contract_address: init};
            let swap_token =  ISwapTokenDispatcher {contract_address: swap};
            let user: ContractAddress = get_caller_address();
            
            assert(init_token.get_balance_of_user(user) >= amount_of_init, 'Not enough Init Tokens');
            
            let swapped_value = (amount_of_init * 10) / 100;

            let total_swap = amount_of_init - swapped_value;
            
            assert(swap_token.get_balance_of_user(get_contract_address()) >= total_swap, 'Not enough contract balance');
            
            init_token.transfer_from(user, get_contract_address(), amount_of_init);
            swap_token.mint(get_contract_address());
            swap_token.transfer(user, total_swap);
            self.emit(Swapped {from: init, to: swap, amount: amount_of_init, swap: total_swap});
        }

        fn swap_swapper_tokens_for_init_tokens(ref self: ContractState, amount_of_swapper: u128) {
            let init: ContractAddress = 0x0481fab6a2a1b946feba582b1e025023982c8b80f3aa02ee71d2876792febb86.try_into().unwrap();
            let swap: ContractAddress = 0x058c68d6a2d4f107cca146c525da86b6a7f1a71fcb4e262e03cc3af05e57737e.try_into().unwrap();
            let init_token =  ITokenDispatcher {contract_address: init};
            let swap_token =  ISwapTokenDispatcher {contract_address: swap};
            
            assert(swap_token.get_balance_of_user(get_caller_address()) >= amount_of_swapper, 'Not enough Swapper Tokens');
            
            let swapped_value = (amount_of_swapper * 10) / 100;

            let total_swap = amount_of_swapper + swapped_value;
            
            assert(init_token.get_balance_of_user(get_contract_address()) >= total_swap, 'Not enough contract balance');
            
            swap_token.transfer_from(get_caller_address(), get_contract_address(), amount_of_swapper);
            init_token.mint(get_contract_address());
            init_token.transfer(get_caller_address(), total_swap);
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