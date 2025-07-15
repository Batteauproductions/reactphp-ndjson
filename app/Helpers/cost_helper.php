<?php

function getCost($asset) {
    // check if profession, skill or item based on unique things to the specific objects
    $isProfession = !property_exists($asset, 'profession_link') && !property_exists($asset, 'amount');
    $isSkill = property_exists($asset, 'profession_link');
    $isItem = !$isProfession && property_exists($asset, 'amount');

    if($isProfession && !$isItem) {
        $total = 0;
        if (!isset($asset->cost) || !isset($asset->rank)) {
            return 0;
        }
        $arr_cost = explode('|', $asset->cost);
        $rank = (int) $asset->rank;
        for ($i = 0; $i < $rank; $i++) {
            $cost = isset($arr_cost[$i]) ? (int) $arr_cost[$i] : 0;
            $total += $cost;
        }
        return $total.'vp';
    }
    if($isSkill) {
        $cost = ($asset->cost * $asset->rank);
        return $cost.'vp';
    }
    if($isItem) {
        $cost = isset($asset->cost) ? (int)$asset->cost : 0;
        $amount = isset($asset->amount) ? (int)$asset->amount : 0;
        $iCurrency = $cost * $amount;

        $iGold = floor($iCurrency / 100);
        $iSilver = floor(($iCurrency % 100) / 10);
        $iCopper = $iCurrency % 10;

        $iSize = 20;
        $baseUrl = base_url();

        $sGold = $iGold > 0 ? $iGold . ' <img src="' . $baseUrl . 'assets/images/elements/coin_gold.png" style="height:' . $iSize . 'px; width:' . $iSize . 'px"/>' : '';
        $sSilver = $iSilver > 0 ? $iSilver . ' <img src="' . $baseUrl . 'assets/images/elements/coin_silver.png" style="height:' . $iSize . 'px; width:' . $iSize . 'px"/>' : '';
        $sCopper = $iCopper > 0 ? $iCopper . ' <img src="' . $baseUrl . 'assets/images/elements/coin_copper.png" style="height:' . $iSize . 'px; width:' . $iSize . 'px"/>' : '';

        return trim($sGold . ' ' . $sSilver . ' ' . $sCopper);
    }
}