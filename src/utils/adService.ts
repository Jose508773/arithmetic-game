// Ad Service for Game Monetization
// This service handles ad loading, displaying, and callbacks for the revival feature

interface AdCallbacks {
  onAdLoaded?: () => void;
  onAdFailed?: (error: string) => void;
  onAdClosed?: () => void;
  onRewarded?: () => void;
}

class AdService {
  private isAdLoaded = false;
  private isAdShowing = false;
  private adCallbacks: AdCallbacks = {};

  constructor() {
    this.initializeAds();
  }

  private initializeAds(): void {
    // Initialize Google AdSense/AdMob
    if (typeof window !== 'undefined' && (window as unknown as { adsbygoogle?: unknown }).adsbygoogle) {
      console.log('✅ Ad service initialized');
      this.loadRewardedAd();
    } else {
      console.log('⚠️ Ad service not available - using mock ads for development');
    }
  }

  private loadRewardedAd(): void {
    try {
      // In a real implementation, this would load an actual rewarded ad
      // For now, we'll simulate ad loading
      setTimeout(() => {
        this.isAdLoaded = true;
        console.log('✅ Rewarded ad loaded successfully');
        this.adCallbacks.onAdLoaded?.();
      }, 1000);
    } catch (error) {
      console.error('❌ Failed to load rewarded ad:', error);
      this.adCallbacks.onAdFailed?.('Failed to load ad');
    }
  }

  public showRewardedAd(callbacks: AdCallbacks): Promise<boolean> {
    return new Promise((resolve) => {
      if (this.isAdShowing) {
        console.log('⚠️ Ad already showing');
        resolve(false);
        return;
      }

      this.adCallbacks = callbacks;

      if (!this.isAdLoaded) {
        console.log('🔄 Loading ad...');
        this.loadRewardedAd();
        setTimeout(() => {
          if (this.isAdLoaded) {
            this.displayAd(resolve);
          } else {
            console.log('❌ Ad failed to load');
            this.adCallbacks.onAdFailed?.('Ad failed to load');
            resolve(false);
          }
        }, 2000);
      } else {
        this.displayAd(resolve);
      }
    });
  }

  private displayAd(resolve: (value: boolean) => void): void {
    this.isAdShowing = true;
    console.log('🎬 Showing rewarded ad...');

    // Simulate ad display
    setTimeout(() => {
      console.log('✅ Ad completed - user earned reward!');
      this.isAdShowing = false;
      this.isAdLoaded = false; // Reset for next ad
      
      this.adCallbacks.onRewarded?.();
      this.adCallbacks.onAdClosed?.();
      
      resolve(true);
    }, 3000); // Simulate 3-second ad
  }

  public isAdAvailable(): boolean {
    return this.isAdLoaded && !this.isAdShowing;
  }

  public preloadAd(): void {
    if (!this.isAdLoaded && !this.isAdShowing) {
      this.loadRewardedAd();
    }
  }
}

// Create singleton instance
export const adService = new AdService();

// Export types for use in components
export type { AdCallbacks }; 