package com.prakruthi.homestay.controller;

import com.prakruthi.homestay.model.DailyPrice;
import com.prakruthi.homestay.model.User;
import com.prakruthi.homestay.service.PricingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class PricingController {

    @Autowired
    private PricingService pricingService;

    @GetMapping("/public/pricing")
    public ResponseEntity<List<DailyPrice>> getPublicPricing(
            @RequestParam String roomId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return ResponseEntity.ok(pricingService.getPricing(roomId, startDate, endDate));
    }

    @PostMapping("/admin/pricing/set-base-price")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> setBasePrice(
            @RequestParam String roomId,
            @RequestParam BigDecimal price,
            @AuthenticationPrincipal User user) {
        pricingService.setDailyPrice(roomId, LocalDate.now(), price, DailyPrice.PriceReason.DEFAULT, user);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/admin/pricing/set-date-price")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> setDatePrice(
            @RequestParam String roomId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestParam BigDecimal price,
            @RequestParam DailyPrice.PriceReason reason,
            @AuthenticationPrincipal User user) {
        pricingService.setDailyPrice(roomId, date, price, reason, user);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/admin/pricing/bulk-update")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> bulkUpdate(
            @RequestParam String roomId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam BigDecimal price,
            @RequestParam DailyPrice.PriceReason reason,
            @AuthenticationPrincipal User user) {
        pricingService.setBulkPricing(roomId, startDate, endDate, price, reason, user);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/rooms/calculate-price")
    public ResponseEntity<BigDecimal> calculatePrice(
            @RequestParam String roomId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        BigDecimal totalPrice = pricingService.calculateTotalPrice(roomId, startDate, endDate);
        return ResponseEntity.ok(totalPrice);
    }

    @GetMapping("/admin/pricing/seasonal")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<DailyPrice>> getSeasonalPricing(
            @RequestParam String roomId,
            @RequestParam DailyPrice.PriceReason reason) {
        return ResponseEntity.ok(pricingService.getSeasonalPricing(roomId, reason));
    }
}
