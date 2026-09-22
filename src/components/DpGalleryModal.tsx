import React, { useState } from 'react';
import { X, Sparkles, Check, Upload, Link as LinkIcon, Camera, RefreshCw, Flame, Heart } from 'lucide-react';
import { Companion } from '../types';
import { DP_PRESETS, DpPreset } from '../data/dpPresets';
import { CompanionPortrait } from './CompanionPortrait';
import { soundEngine } from '../utils/audio';

interface DpGalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  companion: Companion;
  activeDpPreset: DpPreset;
  customDpUrl: string | null;
  onSelectPreset: (preset: DpPreset) => void;
  onSetCustomDpUrl: (url: string | null) => void;
}

export const DpGalleryModal: React.FC<DpGalleryModalProps> = ({
  isOpen,
  onClose,
  companion,
  activeDpPreset,
  customDpUrl,
  onSelectPreset,
  onSetCustomDpUrl,
}) => {
  const [activeTab, setActiveTab] = useState<'presets' | 'custom'>('presets');
  const [customInputUrl, setCustomInputUrl] = useState('');
  const [uploadPreview, setUploadPreview] = useState<string | null>(null);
  const [urlPreviewError, setUrlPreviewError] = useState(false);

  if (!isOpen) return null;

  const presets = DP_PRESETS[companion.id] || DP_PRESETS.pooja;

  // Handle file upload via FileReader to base64
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file (PNG, JPG, WebP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        setUploadPreview(result);
        setUrlPreviewError(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleApplyCustomUrl = () => {
    if (!customInputUrl.trim() && !uploadPreview) return;
    const finalUrl = uploadPreview || customInputUrl.trim();
    soundEngine.playSuccess();
    onSetCustomDpUrl(finalUrl);
    onClose();
  };

  const handleClearCustomDp = () => {
    soundEngine.playButtonClick();
    onSetCustomDpUrl(null);
    setUploadPreview(null);
    setCustomInputUrl('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#0b0f19] border border-rose-500/30 rounded-3xl shadow-[0_0_50px_rgba(244,63,94,0.25)] overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-gradient-to-r from-rose-950/40 via-purple-950/30 to-slate-900/60">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/30">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white tracking-wide">
                  {companion.name}'s DP & Profile Pictures
                </h3>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-semibold border border-rose-500/30">
                  Hot Styles
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Choose from hot curated avatars or upload your own favorite photo
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              soundEngine.playButtonClick();
              onClose();
            }}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center gap-2 px-6 pt-3 pb-2 border-b border-slate-800/80 bg-slate-950/40">
          <button
            onClick={() => {
              soundEngine.playButtonClick();
              setActiveTab('presets');
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'presets'
                ? 'bg-rose-500 text-white shadow-[0_0_15px_rgba(244,63,94,0.4)]'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            <span>Hot Curated DPs</span>
          </button>

          <button
            onClick={() => {
              soundEngine.playButtonClick();
              setActiveTab('custom');
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'custom'
                ? 'bg-rose-500 text-white shadow-[0_0_15px_rgba(244,63,94,0.4)]'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload Photo / Custom URL</span>
          </button>

          {customDpUrl && (
            <button
              onClick={handleClearCustomDp}
              className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition-colors cursor-pointer"
              title="Reset to default preset avatar"
            >
              <RefreshCw className="w-3 h-3 text-slate-400" />
              <span>Reset to Presets</span>
            </button>
          )}
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Active DP Showcase Card */}
          <div className="bg-gradient-to-r from-rose-950/30 via-slate-900/80 to-slate-900/50 border border-rose-500/20 rounded-2xl p-4 flex items-center gap-4">
            <div className="relative">
              <div className="w-20 h-20 rounded-full ring-2 ring-rose-500/60 ring-offset-2 ring-offset-slate-900 shadow-[0_0_20px_rgba(244,63,94,0.4)] overflow-hidden">
                <CompanionPortrait
                  preset={activeDpPreset}
                  customImageUrl={customDpUrl}
                  size="lg"
                  className="w-full h-full"
                />
              </div>
              <span className="absolute bottom-0 right-0 p-1 rounded-full bg-emerald-500 ring-2 ring-slate-900" />
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-bold text-white">
                  {customDpUrl ? 'Custom Photo DP' : activeDpPreset.name}
                </h4>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                  Active in Chat
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {customDpUrl
                  ? 'Your personalized profile picture is active across all conversations.'
                  : activeDpPreset.description}
              </p>
              <div className="mt-2 flex items-center gap-2 text-[11px] text-rose-300 font-medium">
                <Sparkles className="w-3 h-3" />
                <span>Style Vibe: {customDpUrl ? 'Personalized Photo' : activeDpPreset.moodVibe}</span>
              </div>
            </div>
          </div>

          {/* TAB 1: CURATED HOT PRESETS */}
          {activeTab === 'presets' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="font-semibold text-slate-300">Tap any avatar style to select as DP:</span>
                <span>{presets.length} Hot Looks</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {presets.map((preset) => {
                  const isSelected = !customDpUrl && activeDpPreset.id === preset.id;
                  return (
                    <button
                      key={preset.id}
                      onClick={() => {
                        soundEngine.playSuccess();
                        onSetCustomDpUrl(null); // clear custom if any
                        onSelectPreset(preset);
                      }}
                      className={`relative flex items-center gap-3.5 p-3.5 rounded-2xl border text-left transition-all cursor-pointer group ${
                        isSelected
                          ? 'bg-rose-500/15 border-rose-500 ring-1 ring-rose-500/50 shadow-[0_0_20px_rgba(244,63,94,0.25)]'
                          : 'bg-slate-900/70 border-slate-800/90 hover:border-slate-700 hover:bg-slate-800/50'
                      }`}
                    >
                      {/* Avatar Thumbnail */}
                      <div className="relative flex-shrink-0">
                        <div
                          className={`w-16 h-16 rounded-full overflow-hidden transition-all ${
                            isSelected
                              ? 'ring-2 ring-rose-500 shadow-md scale-105'
                              : 'ring-1 ring-slate-700 group-hover:scale-105'
                          }`}
                        >
                          <CompanionPortrait preset={preset} size="md" className="w-full h-full" />
                        </div>
                        {isSelected && (
                          <div className="absolute -top-1 -right-1 p-1 rounded-full bg-rose-500 text-white shadow-md">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-rose-500/20 text-rose-300 border border-rose-500/30">
                            {preset.styleTag}
                          </span>
                        </div>
                        <h5 className="font-bold text-sm text-white mt-1 group-hover:text-rose-200 transition-colors">
                          {preset.name}
                        </h5>
                        <p className="text-[11px] text-slate-400 line-clamp-2 mt-0.5 leading-relaxed">
                          {preset.description}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: UPLOAD PHOTO / CUSTOM URL */}
          {activeTab === 'custom' && (
            <div className="space-y-4">
              {/* Option A: Upload Device Photo */}
              <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 space-y-3">
                <div className="flex items-center gap-2 text-white font-bold text-sm">
                  <Upload className="w-4 h-4 text-rose-400" />
                  <span>Option A: Upload Photo from Your Device</span>
                </div>
                <p className="text-xs text-slate-400">
                  Select any high-resolution photo from your gallery or computer. It will be stored safely in your browser for this companion.
                </p>

                <div className="flex items-center gap-3">
                  <label className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-dashed border-rose-500/40 bg-rose-500/5 hover:bg-rose-500/10 text-rose-300 text-xs font-semibold cursor-pointer transition-colors">
                    <Camera className="w-4 h-4" />
                    <span>Choose Photo File</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>

                  {uploadPreview && (
                    <div className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-rose-500 flex-shrink-0">
                      <img
                        src={uploadPreview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Option B: Direct Image URL */}
              <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 space-y-3">
                <div className="flex items-center gap-2 text-white font-bold text-sm">
                  <LinkIcon className="w-4 h-4 text-rose-400" />
                  <span>Option B: Paste Direct Image URL</span>
                </div>
                <p className="text-xs text-slate-400">
                  Paste any valid image link (e.g. https://.../photo.jpg).
                </p>

                <div className="flex items-center gap-2">
                  <input
                    type="url"
                    placeholder="https://example.com/photo.jpg"
                    value={customInputUrl}
                    onChange={(e) => {
                      setCustomInputUrl(e.target.value);
                      setUrlPreviewError(false);
                    }}
                    className="flex-1 px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-rose-500"
                  />
                </div>

                {customInputUrl && (
                  <div className="flex items-center gap-3 pt-2">
                    <div className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-rose-500 flex-shrink-0 bg-slate-900">
                      <img
                        src={customInputUrl}
                        alt="URL Preview"
                        referrerPolicy="no-referrer"
                        onError={() => setUrlPreviewError(true)}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="text-xs text-slate-400">
                      {urlPreviewError ? (
                        <span className="text-rose-400 font-semibold">⚠️ Image failed to load, check URL</span>
                      ) : (
                        'Image preview loaded successfully!'
                      )}
                    </span>
                  </div>
                )}
              </div>

              {/* Save Button */}
              <button
                onClick={handleApplyCustomUrl}
                disabled={(!uploadPreview && !customInputUrl.trim()) || urlPreviewError}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-bold text-xs shadow-[0_0_20px_rgba(244,63,94,0.4)] disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Check className="w-4 h-4" />
                <span>Save and Apply Custom DP</span>
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between text-xs text-slate-400">
          <span>Active Companion: <strong className="text-slate-200">{companion.name}</strong></span>
          <button
            onClick={() => {
              soundEngine.playButtonClick();
              onClose();
            }}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
