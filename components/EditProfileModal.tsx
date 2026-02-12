import React, { useState, useRef } from 'react';
import { UserProfile, authService } from '../services/authService';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile | null;
  userId: string;
  onSave: (updatedProfile: UserProfile) => void;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isOpen,
  onClose,
  profile,
  userId,
  onSave,
}) => {
  const [formData, setFormData] = useState<Partial<UserProfile>>({
    name: profile?.name || '',
    birthdate: profile?.birthdate || '',
    bio: profile?.bio || '',
    profile_photo_url: profile?.profile_photo_url || '',
    youtube_url: profile?.youtube_url || '',
    twitter_url: profile?.twitter_url || '',
    tiktok_url: profile?.tiktok_url || '',
    instagram_url: profile?.instagram_url || '',
    github_url: profile?.github_url || '',
    website_url: profile?.website_url || '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [photoPreview, setPhotoPreview] = useState(profile?.profile_photo_url || '');
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setPhotoPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    setIsLoading(true);
    const { url, error: uploadError } = await authService.uploadProfilePhoto(userId, file);
    setIsLoading(false);

    if (uploadError) {
      setError(uploadError);
    } else if (url) {
      setFormData({ ...formData, profile_photo_url: url });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const { error: updateError } = await authService.updateProfile(userId, formData);
    setIsLoading(false);

    if (updateError) {
      setError(updateError);
    } else {
      onSave({
        ...profile,
        ...formData,
      } as UserProfile);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">Edit Profil</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-900"
          >
            <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
              <path d="M18.3 5.71L12.71 11.3l5.59 5.59L17.3 18.3L11.7 12.71l-5.59 5.59L5 17.3l5.59-5.59L5.71 6.3l1.41-1.41L11.3 10.29l5.59-5.59z" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="flex flex-col items-center gap-4">
            <div
              onClick={() => fileInputRef.current?.click()}
              className="relative w-32 h-32 rounded-full border-4 border-blue-300 cursor-pointer hover:opacity-80 transition-opacity overflow-hidden bg-gray-100"
            >
              {photoPreview ? (
                <img src={photoPreview} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <svg viewBox="0 0 24 24" className="w-12 h-12 fill-current">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z" />
                  </svg>
                </div>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="text-sm text-blue-600 font-bold hover:underline"
            >
              Ubah Foto Profil
            </button>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Nama</label>
            <input
              type="text"
              name="name"
              value={formData.name || ''}
              onChange={handleInputChange}
              maxLength={50}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              placeholder="Nama lengkap"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Tanggal Lahir</label>
            <input
              type="date"
              name="birthdate"
              value={formData.birthdate || ''}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Bio</label>
            <textarea
              name="bio"
              value={formData.bio || ''}
              onChange={handleInputChange}
              maxLength={160}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 resize-none"
              placeholder="Ceritakan tentang diri Anda"
            />
            <p className="text-xs text-gray-500 mt-1">{(formData.bio || '').length}/160</p>
          </div>

          <div className="border-t pt-4">
            <h3 className="text-sm font-bold text-gray-700 mb-3">Tautan Media Sosial</h3>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">YouTube</label>
                <input
                  type="url"
                  name="youtube_url"
                  value={formData.youtube_url || ''}
                  onChange={handleInputChange}
                  placeholder="https://youtube.com/@user"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">Twitter/X</label>
                <input
                  type="url"
                  name="twitter_url"
                  value={formData.twitter_url || ''}
                  onChange={handleInputChange}
                  placeholder="https://twitter.com/user"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">TikTok</label>
                <input
                  type="url"
                  name="tiktok_url"
                  value={formData.tiktok_url || ''}
                  onChange={handleInputChange}
                  placeholder="https://tiktok.com/@user"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">Instagram</label>
                <input
                  type="url"
                  name="instagram_url"
                  value={formData.instagram_url || ''}
                  onChange={handleInputChange}
                  placeholder="https://instagram.com/user"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">GitHub</label>
                <input
                  type="url"
                  name="github_url"
                  value={formData.github_url || ''}
                  onChange={handleInputChange}
                  placeholder="https://github.com/user"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">Website</label>
                <input
                  type="url"
                  name="website_url"
                  value={formData.website_url || ''}
                  onChange={handleInputChange}
                  placeholder="https://example.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {error && (
            <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg border border-red-200">
              {error}
            </div>
          )}

          <div className="flex gap-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg font-bold hover:bg-gray-50 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {isLoading ? 'Menyimpan...' : 'Simpan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;
