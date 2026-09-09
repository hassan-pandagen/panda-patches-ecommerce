/**
 * Real product photographs, resolved once from the Sanity galleries.
 *
 * WHY A GENERATED CONSTANT: the pages that use these build their Product schema
 * at module scope, so they cannot await a Sanity fetch without restructuring
 * each one. Sanity CDN URLs are content-addressed by asset id and stable, so
 * resolving them once and committing the result is safe and keeps eighteen
 * pages from each growing a data-fetching layer they need for one field.
 *
 * Each URL is given in the three aspect ratios Google renders product images at
 * (1:1, 4:3, 16:9) so a rich result can pick whichever fits its slot.
 *
 * REGENERATE when the galleries change:
 *   node scripts/gen-representative-images.mjs
 * It re-reads Sanity and HEAD-checks every URL before writing. Do not hand-edit.
 *
 * Generated 2026-09-09 from 33 gallery photographs.
 */
export const TYPE_PHOTOS: Record<string, string[][]> = {
  "chenille": [
    [
      "https://cdn.sanity.io/images/hjpcv7rv/production/1cf92b89c6c62dd4d2a8e78c51139f98f1ff70f4-4500x4500.jpg?w=1200&h=1200&fit=crop&auto=format&q=80",
      "https://cdn.sanity.io/images/hjpcv7rv/production/1cf92b89c6c62dd4d2a8e78c51139f98f1ff70f4-4500x4500.jpg?w=1200&h=900&fit=crop&auto=format&q=80",
      "https://cdn.sanity.io/images/hjpcv7rv/production/1cf92b89c6c62dd4d2a8e78c51139f98f1ff70f4-4500x4500.jpg?w=1200&h=675&fit=crop&auto=format&q=80"
    ],
    [
      "https://cdn.sanity.io/images/hjpcv7rv/production/50f7f071b6e2bf0840b49db9cc87ed31f0dd45ff-4500x4500.jpg?w=1200&h=1200&fit=crop&auto=format&q=80",
      "https://cdn.sanity.io/images/hjpcv7rv/production/50f7f071b6e2bf0840b49db9cc87ed31f0dd45ff-4500x4500.jpg?w=1200&h=900&fit=crop&auto=format&q=80",
      "https://cdn.sanity.io/images/hjpcv7rv/production/50f7f071b6e2bf0840b49db9cc87ed31f0dd45ff-4500x4500.jpg?w=1200&h=675&fit=crop&auto=format&q=80"
    ],
    [
      "https://cdn.sanity.io/images/hjpcv7rv/production/ca9948ec721a3777cc9d8bc75eb53338e6430906-4500x4475.jpg?w=1200&h=1200&fit=crop&auto=format&q=80",
      "https://cdn.sanity.io/images/hjpcv7rv/production/ca9948ec721a3777cc9d8bc75eb53338e6430906-4500x4475.jpg?w=1200&h=900&fit=crop&auto=format&q=80",
      "https://cdn.sanity.io/images/hjpcv7rv/production/ca9948ec721a3777cc9d8bc75eb53338e6430906-4500x4475.jpg?w=1200&h=675&fit=crop&auto=format&q=80"
    ],
    [
      "https://cdn.sanity.io/images/hjpcv7rv/production/4c403729130578fee7f93d75501c5f52c45b24de-4500x4500.jpg?w=1200&h=1200&fit=crop&auto=format&q=80",
      "https://cdn.sanity.io/images/hjpcv7rv/production/4c403729130578fee7f93d75501c5f52c45b24de-4500x4500.jpg?w=1200&h=900&fit=crop&auto=format&q=80",
      "https://cdn.sanity.io/images/hjpcv7rv/production/4c403729130578fee7f93d75501c5f52c45b24de-4500x4500.jpg?w=1200&h=675&fit=crop&auto=format&q=80"
    ],
    [
      "https://cdn.sanity.io/images/hjpcv7rv/production/eddf479f46477f78e00fbf910e4935d2ec405802-4500x4500.jpg?w=1200&h=1200&fit=crop&auto=format&q=80",
      "https://cdn.sanity.io/images/hjpcv7rv/production/eddf479f46477f78e00fbf910e4935d2ec405802-4500x4500.jpg?w=1200&h=900&fit=crop&auto=format&q=80",
      "https://cdn.sanity.io/images/hjpcv7rv/production/eddf479f46477f78e00fbf910e4935d2ec405802-4500x4500.jpg?w=1200&h=675&fit=crop&auto=format&q=80"
    ]
  ],
  "sequin": [
    [
      "https://cdn.sanity.io/images/hjpcv7rv/production/c827c5517483b9c28df54d142ef4dbabc9dc630d-4500x4500.jpg?w=1200&h=1200&fit=crop&auto=format&q=80",
      "https://cdn.sanity.io/images/hjpcv7rv/production/c827c5517483b9c28df54d142ef4dbabc9dc630d-4500x4500.jpg?w=1200&h=900&fit=crop&auto=format&q=80",
      "https://cdn.sanity.io/images/hjpcv7rv/production/c827c5517483b9c28df54d142ef4dbabc9dc630d-4500x4500.jpg?w=1200&h=675&fit=crop&auto=format&q=80"
    ],
    [
      "https://cdn.sanity.io/images/hjpcv7rv/production/a2957e21e4e6b52b39c4f716e9d39b00425b0c40-4500x4500.jpg?w=1200&h=1200&fit=crop&auto=format&q=80",
      "https://cdn.sanity.io/images/hjpcv7rv/production/a2957e21e4e6b52b39c4f716e9d39b00425b0c40-4500x4500.jpg?w=1200&h=900&fit=crop&auto=format&q=80",
      "https://cdn.sanity.io/images/hjpcv7rv/production/a2957e21e4e6b52b39c4f716e9d39b00425b0c40-4500x4500.jpg?w=1200&h=675&fit=crop&auto=format&q=80"
    ],
    [
      "https://cdn.sanity.io/images/hjpcv7rv/production/9c4cf49a518183219878ebbf482f15899a4b70bf-4501x4500.jpg?w=1200&h=1200&fit=crop&auto=format&q=80",
      "https://cdn.sanity.io/images/hjpcv7rv/production/9c4cf49a518183219878ebbf482f15899a4b70bf-4501x4500.jpg?w=1200&h=900&fit=crop&auto=format&q=80",
      "https://cdn.sanity.io/images/hjpcv7rv/production/9c4cf49a518183219878ebbf482f15899a4b70bf-4501x4500.jpg?w=1200&h=675&fit=crop&auto=format&q=80"
    ]
  ],
  "embroidered": [
    [
      "https://cdn.sanity.io/images/hjpcv7rv/production/2330e9b897dafad5ecb5146d93d4465375dacb66-4500x4475.jpg?w=1200&h=1200&fit=crop&auto=format&q=80",
      "https://cdn.sanity.io/images/hjpcv7rv/production/2330e9b897dafad5ecb5146d93d4465375dacb66-4500x4475.jpg?w=1200&h=900&fit=crop&auto=format&q=80",
      "https://cdn.sanity.io/images/hjpcv7rv/production/2330e9b897dafad5ecb5146d93d4465375dacb66-4500x4475.jpg?w=1200&h=675&fit=crop&auto=format&q=80"
    ],
    [
      "https://cdn.sanity.io/images/hjpcv7rv/production/3b2cc37edf03863be5d8257d0f144287fbb7d07a-4500x4475.jpg?w=1200&h=1200&fit=crop&auto=format&q=80",
      "https://cdn.sanity.io/images/hjpcv7rv/production/3b2cc37edf03863be5d8257d0f144287fbb7d07a-4500x4475.jpg?w=1200&h=900&fit=crop&auto=format&q=80",
      "https://cdn.sanity.io/images/hjpcv7rv/production/3b2cc37edf03863be5d8257d0f144287fbb7d07a-4500x4475.jpg?w=1200&h=675&fit=crop&auto=format&q=80"
    ],
    [
      "https://cdn.sanity.io/images/hjpcv7rv/production/8c3f8e1f0695c08069faacffe361c95581328480-4500x4475.jpg?w=1200&h=1200&fit=crop&auto=format&q=80",
      "https://cdn.sanity.io/images/hjpcv7rv/production/8c3f8e1f0695c08069faacffe361c95581328480-4500x4475.jpg?w=1200&h=900&fit=crop&auto=format&q=80",
      "https://cdn.sanity.io/images/hjpcv7rv/production/8c3f8e1f0695c08069faacffe361c95581328480-4500x4475.jpg?w=1200&h=675&fit=crop&auto=format&q=80"
    ],
    [
      "https://cdn.sanity.io/images/hjpcv7rv/production/46a0c88944847b1c7d691252e9bdefe4d142fcd9-4500x4475.jpg?w=1200&h=1200&fit=crop&auto=format&q=80",
      "https://cdn.sanity.io/images/hjpcv7rv/production/46a0c88944847b1c7d691252e9bdefe4d142fcd9-4500x4475.jpg?w=1200&h=900&fit=crop&auto=format&q=80",
      "https://cdn.sanity.io/images/hjpcv7rv/production/46a0c88944847b1c7d691252e9bdefe4d142fcd9-4500x4475.jpg?w=1200&h=675&fit=crop&auto=format&q=80"
    ],
    [
      "https://cdn.sanity.io/images/hjpcv7rv/production/fc568266f127b606724d05413fb228d0242131e8-4500x4475.jpg?w=1200&h=1200&fit=crop&auto=format&q=80",
      "https://cdn.sanity.io/images/hjpcv7rv/production/fc568266f127b606724d05413fb228d0242131e8-4500x4475.jpg?w=1200&h=900&fit=crop&auto=format&q=80",
      "https://cdn.sanity.io/images/hjpcv7rv/production/fc568266f127b606724d05413fb228d0242131e8-4500x4475.jpg?w=1200&h=675&fit=crop&auto=format&q=80"
    ],
    [
      "https://cdn.sanity.io/images/hjpcv7rv/production/58f21e9f3cb2897ed7c9bffd42fb88d924a94a11-4500x4475.jpg?w=1200&h=1200&fit=crop&auto=format&q=80",
      "https://cdn.sanity.io/images/hjpcv7rv/production/58f21e9f3cb2897ed7c9bffd42fb88d924a94a11-4500x4475.jpg?w=1200&h=900&fit=crop&auto=format&q=80",
      "https://cdn.sanity.io/images/hjpcv7rv/production/58f21e9f3cb2897ed7c9bffd42fb88d924a94a11-4500x4475.jpg?w=1200&h=675&fit=crop&auto=format&q=80"
    ]
  ],
  "printed": [
    [
      "https://cdn.sanity.io/images/hjpcv7rv/production/aafba88d54a99e6aec13d7285f01f8430fdf2e61-4500x4475.jpg?w=1200&h=1200&fit=crop&auto=format&q=80",
      "https://cdn.sanity.io/images/hjpcv7rv/production/aafba88d54a99e6aec13d7285f01f8430fdf2e61-4500x4475.jpg?w=1200&h=900&fit=crop&auto=format&q=80",
      "https://cdn.sanity.io/images/hjpcv7rv/production/aafba88d54a99e6aec13d7285f01f8430fdf2e61-4500x4475.jpg?w=1200&h=675&fit=crop&auto=format&q=80"
    ],
    [
      "https://cdn.sanity.io/images/hjpcv7rv/production/822a95e79f595ffe763adb5d7bf0f0c366241969-4500x4475.jpg?w=1200&h=1200&fit=crop&auto=format&q=80",
      "https://cdn.sanity.io/images/hjpcv7rv/production/822a95e79f595ffe763adb5d7bf0f0c366241969-4500x4475.jpg?w=1200&h=900&fit=crop&auto=format&q=80",
      "https://cdn.sanity.io/images/hjpcv7rv/production/822a95e79f595ffe763adb5d7bf0f0c366241969-4500x4475.jpg?w=1200&h=675&fit=crop&auto=format&q=80"
    ],
    [
      "https://cdn.sanity.io/images/hjpcv7rv/production/f1f281407c75063af52320d9609ba4ee4ae637d7-4500x4475.jpg?w=1200&h=1200&fit=crop&auto=format&q=80",
      "https://cdn.sanity.io/images/hjpcv7rv/production/f1f281407c75063af52320d9609ba4ee4ae637d7-4500x4475.jpg?w=1200&h=900&fit=crop&auto=format&q=80",
      "https://cdn.sanity.io/images/hjpcv7rv/production/f1f281407c75063af52320d9609ba4ee4ae637d7-4500x4475.jpg?w=1200&h=675&fit=crop&auto=format&q=80"
    ],
    [
      "https://cdn.sanity.io/images/hjpcv7rv/production/b4a9f1f69f53207b2e82f8cfa30d77061059c801-4500x4475.jpg?w=1200&h=1200&fit=crop&auto=format&q=80",
      "https://cdn.sanity.io/images/hjpcv7rv/production/b4a9f1f69f53207b2e82f8cfa30d77061059c801-4500x4475.jpg?w=1200&h=900&fit=crop&auto=format&q=80",
      "https://cdn.sanity.io/images/hjpcv7rv/production/b4a9f1f69f53207b2e82f8cfa30d77061059c801-4500x4475.jpg?w=1200&h=675&fit=crop&auto=format&q=80"
    ],
    [
      "https://cdn.sanity.io/images/hjpcv7rv/production/665a368c57f296e1e2fb7065c5a4fc8c3a8844fd-4500x4475.jpg?w=1200&h=1200&fit=crop&auto=format&q=80",
      "https://cdn.sanity.io/images/hjpcv7rv/production/665a368c57f296e1e2fb7065c5a4fc8c3a8844fd-4500x4475.jpg?w=1200&h=900&fit=crop&auto=format&q=80",
      "https://cdn.sanity.io/images/hjpcv7rv/production/665a368c57f296e1e2fb7065c5a4fc8c3a8844fd-4500x4475.jpg?w=1200&h=675&fit=crop&auto=format&q=80"
    ]
  ],
  "leather": [
    [
      "https://cdn.sanity.io/images/hjpcv7rv/production/aec3a52db55b3243b6c455af33e1728f57996678-4500x4500.jpg?w=1200&h=1200&fit=crop&auto=format&q=80",
      "https://cdn.sanity.io/images/hjpcv7rv/production/aec3a52db55b3243b6c455af33e1728f57996678-4500x4500.jpg?w=1200&h=900&fit=crop&auto=format&q=80",
      "https://cdn.sanity.io/images/hjpcv7rv/production/aec3a52db55b3243b6c455af33e1728f57996678-4500x4500.jpg?w=1200&h=675&fit=crop&auto=format&q=80"
    ],
    [
      "https://cdn.sanity.io/images/hjpcv7rv/production/45a0e11bc3a192a652fd7448bca8898aac33d265-4500x4475.jpg?w=1200&h=1200&fit=crop&auto=format&q=80",
      "https://cdn.sanity.io/images/hjpcv7rv/production/45a0e11bc3a192a652fd7448bca8898aac33d265-4500x4475.jpg?w=1200&h=900&fit=crop&auto=format&q=80",
      "https://cdn.sanity.io/images/hjpcv7rv/production/45a0e11bc3a192a652fd7448bca8898aac33d265-4500x4475.jpg?w=1200&h=675&fit=crop&auto=format&q=80"
    ],
    [
      "https://cdn.sanity.io/images/hjpcv7rv/production/41f39a3759c5e3db9f50a5e7e3e79a9687adab17-4500x4475.jpg?w=1200&h=1200&fit=crop&auto=format&q=80",
      "https://cdn.sanity.io/images/hjpcv7rv/production/41f39a3759c5e3db9f50a5e7e3e79a9687adab17-4500x4475.jpg?w=1200&h=900&fit=crop&auto=format&q=80",
      "https://cdn.sanity.io/images/hjpcv7rv/production/41f39a3759c5e3db9f50a5e7e3e79a9687adab17-4500x4475.jpg?w=1200&h=675&fit=crop&auto=format&q=80"
    ],
    [
      "https://cdn.sanity.io/images/hjpcv7rv/production/b8c4e8e4fa98ab67e5bfc05d6a89fdb487405b3e-4500x4475.jpg?w=1200&h=1200&fit=crop&auto=format&q=80",
      "https://cdn.sanity.io/images/hjpcv7rv/production/b8c4e8e4fa98ab67e5bfc05d6a89fdb487405b3e-4500x4475.jpg?w=1200&h=900&fit=crop&auto=format&q=80",
      "https://cdn.sanity.io/images/hjpcv7rv/production/b8c4e8e4fa98ab67e5bfc05d6a89fdb487405b3e-4500x4475.jpg?w=1200&h=675&fit=crop&auto=format&q=80"
    ]
  ],
  "woven": [
    [
      "https://cdn.sanity.io/images/hjpcv7rv/production/e9d95a6f04df5cab98ce51cebb570a2994481691-4500x4500.jpg?w=1200&h=1200&fit=crop&auto=format&q=80",
      "https://cdn.sanity.io/images/hjpcv7rv/production/e9d95a6f04df5cab98ce51cebb570a2994481691-4500x4500.jpg?w=1200&h=900&fit=crop&auto=format&q=80",
      "https://cdn.sanity.io/images/hjpcv7rv/production/e9d95a6f04df5cab98ce51cebb570a2994481691-4500x4500.jpg?w=1200&h=675&fit=crop&auto=format&q=80"
    ],
    [
      "https://cdn.sanity.io/images/hjpcv7rv/production/81d1722c0984804448e53b4a4dd229301a5495bc-4500x4475.jpg?w=1200&h=1200&fit=crop&auto=format&q=80",
      "https://cdn.sanity.io/images/hjpcv7rv/production/81d1722c0984804448e53b4a4dd229301a5495bc-4500x4475.jpg?w=1200&h=900&fit=crop&auto=format&q=80",
      "https://cdn.sanity.io/images/hjpcv7rv/production/81d1722c0984804448e53b4a4dd229301a5495bc-4500x4475.jpg?w=1200&h=675&fit=crop&auto=format&q=80"
    ],
    [
      "https://cdn.sanity.io/images/hjpcv7rv/production/66c7d927e67c74a1980f66c4747d1cb2380b551a-4500x4475.jpg?w=1200&h=1200&fit=crop&auto=format&q=80",
      "https://cdn.sanity.io/images/hjpcv7rv/production/66c7d927e67c74a1980f66c4747d1cb2380b551a-4500x4475.jpg?w=1200&h=900&fit=crop&auto=format&q=80",
      "https://cdn.sanity.io/images/hjpcv7rv/production/66c7d927e67c74a1980f66c4747d1cb2380b551a-4500x4475.jpg?w=1200&h=675&fit=crop&auto=format&q=80"
    ],
    [
      "https://cdn.sanity.io/images/hjpcv7rv/production/ab81fdff896d388d5ee66532f095d1b4bbc7de8e-4500x4475.jpg?w=1200&h=1200&fit=crop&auto=format&q=80",
      "https://cdn.sanity.io/images/hjpcv7rv/production/ab81fdff896d388d5ee66532f095d1b4bbc7de8e-4500x4475.jpg?w=1200&h=900&fit=crop&auto=format&q=80",
      "https://cdn.sanity.io/images/hjpcv7rv/production/ab81fdff896d388d5ee66532f095d1b4bbc7de8e-4500x4475.jpg?w=1200&h=675&fit=crop&auto=format&q=80"
    ],
    [
      "https://cdn.sanity.io/images/hjpcv7rv/production/aa49cacad599cd705176500983b6c218e6ecebfc-4500x4475.jpg?w=1200&h=1200&fit=crop&auto=format&q=80",
      "https://cdn.sanity.io/images/hjpcv7rv/production/aa49cacad599cd705176500983b6c218e6ecebfc-4500x4475.jpg?w=1200&h=900&fit=crop&auto=format&q=80",
      "https://cdn.sanity.io/images/hjpcv7rv/production/aa49cacad599cd705176500983b6c218e6ecebfc-4500x4475.jpg?w=1200&h=675&fit=crop&auto=format&q=80"
    ]
  ],
  "pvc": [
    [
      "https://cdn.sanity.io/images/hjpcv7rv/production/e2c6ae7c791a6cc03d855f210c2afebeeb653764-4500x4475.jpg?w=1200&h=1200&fit=crop&auto=format&q=80",
      "https://cdn.sanity.io/images/hjpcv7rv/production/e2c6ae7c791a6cc03d855f210c2afebeeb653764-4500x4475.jpg?w=1200&h=900&fit=crop&auto=format&q=80",
      "https://cdn.sanity.io/images/hjpcv7rv/production/e2c6ae7c791a6cc03d855f210c2afebeeb653764-4500x4475.jpg?w=1200&h=675&fit=crop&auto=format&q=80"
    ],
    [
      "https://cdn.sanity.io/images/hjpcv7rv/production/9f760f3ef96d63ccaf1043cfccbbf29ff71176d7-4500x4475.jpg?w=1200&h=1200&fit=crop&auto=format&q=80",
      "https://cdn.sanity.io/images/hjpcv7rv/production/9f760f3ef96d63ccaf1043cfccbbf29ff71176d7-4500x4475.jpg?w=1200&h=900&fit=crop&auto=format&q=80",
      "https://cdn.sanity.io/images/hjpcv7rv/production/9f760f3ef96d63ccaf1043cfccbbf29ff71176d7-4500x4475.jpg?w=1200&h=675&fit=crop&auto=format&q=80"
    ],
    [
      "https://cdn.sanity.io/images/hjpcv7rv/production/2b55e7e889c25e3444f7bb171564fca67c2cf9ed-4500x4475.jpg?w=1200&h=1200&fit=crop&auto=format&q=80",
      "https://cdn.sanity.io/images/hjpcv7rv/production/2b55e7e889c25e3444f7bb171564fca67c2cf9ed-4500x4475.jpg?w=1200&h=900&fit=crop&auto=format&q=80",
      "https://cdn.sanity.io/images/hjpcv7rv/production/2b55e7e889c25e3444f7bb171564fca67c2cf9ed-4500x4475.jpg?w=1200&h=675&fit=crop&auto=format&q=80"
    ],
    [
      "https://cdn.sanity.io/images/hjpcv7rv/production/7f2792dd491a92e9e23d7d6737ab505f9122e0a0-4500x4475.jpg?w=1200&h=1200&fit=crop&auto=format&q=80",
      "https://cdn.sanity.io/images/hjpcv7rv/production/7f2792dd491a92e9e23d7d6737ab505f9122e0a0-4500x4475.jpg?w=1200&h=900&fit=crop&auto=format&q=80",
      "https://cdn.sanity.io/images/hjpcv7rv/production/7f2792dd491a92e9e23d7d6737ab505f9122e0a0-4500x4475.jpg?w=1200&h=675&fit=crop&auto=format&q=80"
    ],
    [
      "https://cdn.sanity.io/images/hjpcv7rv/production/f60455cef94051eebbefe6c0a820c757b86ac4da-4500x4475.jpg?w=1200&h=1200&fit=crop&auto=format&q=80",
      "https://cdn.sanity.io/images/hjpcv7rv/production/f60455cef94051eebbefe6c0a820c757b86ac4da-4500x4475.jpg?w=1200&h=900&fit=crop&auto=format&q=80",
      "https://cdn.sanity.io/images/hjpcv7rv/production/f60455cef94051eebbefe6c0a820c757b86ac4da-4500x4475.jpg?w=1200&h=675&fit=crop&auto=format&q=80"
    ]
  ]
};

/**
 * A representative photograph for a page that has no product photo of its own.
 *
 * The eighteen callers are attribute and audience pages — a backing type, a
 * country, a use case — whose underlying product is an ordinary custom patch.
 * Each names the patch type it best represents and an index into that type's
 * gallery, so pages sharing a type do not all show the same photograph.
 *
 * Returns the OG card only if the type or index is missing, which the
 * audit:products guard will then catch.
 */
export function representativeImage(type: string, index = 0): string[] {
  const sets = TYPE_PHOTOS[type];
  if (!sets?.length) return ['https://www.pandapatches.com/assets/og-image.png'];
  return sets[index % sets.length];
}
